import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { FilterOptionsRequestSchema, KeywordRequestSchema, KeywordResponseSchema } from "./digikey-schema.js";

async function searchDigikey(query: string, accessToken: string, filter?: z.infer<typeof FilterOptionsRequestSchema>) {
  const searchUrl = 'https://api.digikey.com/products/v4/search/keyword';
  const requestBody: z.infer<typeof KeywordRequestSchema> = {
    Keywords: query,
    Limit: 10,
    FilterOptionsRequest: filter,
  };
  
  const searchResponse = await fetch(searchUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-DIGIKEY-Client-Id': process.env.DIGIKEY_CLIENT_ID!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!searchResponse.ok) {
    throw new Error(`Failed to search DigiKey: ${searchResponse.status} ${searchResponse.statusText}`);
  }
  
  return await searchResponse.json();
}

const server = new McpServer({
  name: "Parts Finder",
  version: "1.0.0"
});

server.tool(
  "queryDigikey",
  "Query Digikey for parts",
  { query: z.string() },
  async ({ query }) => {
    // Get DigiKey access token
    const tokenUrl = 'https://api.digikey.com/v1/oauth2/token';
    const clientId = process.env.DIGIKEY_CLIENT_ID;
    const clientSecret = process.env.DIGIKEY_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      throw new Error('DigiKey API credentials are not configured');
    }

    const { object: simplifiedQuery } = await generateObject({
      model: google('gemini-2.0-flash'),
      prompt: `
      The user is trying to search digikey for electronic parts.
      The digikey search system is pretty rudimentary, so please break the query into a basic keyword or phrase that can be used.
      We will refine the search later. Here is the users search query:
  
      ${query}
      `,
      schema: z.object({
        query: z.string(),
      }),
    })

    // Request digikey access token
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      })
    });
    
    if (!tokenResponse.ok) {
      throw new Error(`Failed to get access token: ${tokenResponse.status} ${tokenResponse.statusText}`);
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    const prevResults : {filter?: z.infer<typeof FilterOptionsRequestSchema>, response: z.infer<typeof KeywordResponseSchema>}[] = [{filter: undefined, response: await searchDigikey(simplifiedQuery.query, accessToken)}]
    while (prevResults.length < 8) {
      const { object: newFilter } = await generateObject({
        model: google('gemini-2.0-flash'),
        //model: mistral('mistral-small-latest'),
        //model: openai('gpt-4o-mini'),
        //model: openai('o3-mini'),
        //model: bedrock('us.anthropic.claude-3-7-sonnet-20250219-v1:0'),
        prompt: `
        You are helping somebody search for electronic parts using the digikey api and they gave you '${query}' as the query.
        We ran the query along with some filters, but the api only returned general results (we are using the 'Products' array in the response as the results) as well as some additional filters that can be used to refine the search.
        Please select some filters to improve the relevance (i.e. how well the results match the query) of the results without reducing the result count to 0.
        Please only use filters that are present in the response from the last api call provided below (i.e. in the FilterOptions field of that response). Do not make up any filter ids, only use filter ids that are present in that response.
        Don't stop refining the results if you think there are still improvements to be made. You may remove filters if they have made the results worse.
        Try not to be too narrow when applying the filter (e.g. if the query is for "small display", don't assume that it should be exactly 2 inches wide and filter for that, but maybe filtering for 1 to 4 inches could work).

        Here is the previous search history as a JSON array (remember to only use the filter options from the last element in the list):
        ${JSON.stringify(prevResults)}
        `,
        schema: z.object({
          done: z.boolean().describe("Indicates that the results are good enough and we don't need to keep adjusting filters."),
          reason: z.string().describe("A reason for why the results are good enough or why we need to keep adjusting filters."),
          newFilters: FilterOptionsRequestSchema.optional().describe("New filters to apply. You don't need to return any values for this field if the results are already good."),
        }),
      })
      if (newFilter.done || !newFilter.newFilters) break
      prevResults.push({filter: newFilter.newFilters, response: await searchDigikey(simplifiedQuery.query, accessToken, newFilter.newFilters)})
    }

    // Get the final search results
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(prevResults.at(-1)?.response)
        }
      ]
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);