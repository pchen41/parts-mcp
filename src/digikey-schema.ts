import { z } from 'zod';

// Input schema for part search
const FilterIdSchema = z.object({
  Id: z.string().describe('The Id of the Filter'),
});

const ParametricCategorySchema = z.object({
    ParameterId: z.number().int().describe('Parameter Id'),
    FilterValues: z.array(FilterIdSchema).describe('List of FilterIdDtos'),
});


const ParameterFilterRequestSchema = z.object({
    CategoryFilter: FilterIdSchema.optional(),
    ParameterFilters: z.array(ParametricCategorySchema).describe('The list of search parameters').optional(),
});

const SortOptionsSchema = z.object({
    Field: z.enum([
        "None",
        "Packaging",
        "ProductStatus",
        "DigiKeyProductNumber",
        "ManufacturerProductNumber",
        "Manufacturer",
        "MinimumQuantity",
        "QuantityAvailable",
        "Price",
        "Supplier",
        "PriceManufacturerStandardPackage"
    ]).describe('Field in response to sort by'),
    SortOrder: z.enum([
        "Ascending",
        "Descending"
    ]).describe('Direction to sort by Ascending or Descending')
})

export const FilterOptionsRequestSchema = z.object({
    ManufacturerFilter: z.array(FilterIdSchema).describe('Filter on Manufacturer').optional(),
    CategoryFilter: z.array(FilterIdSchema).describe('Category').optional(),
    StatusFilter: z.array(FilterIdSchema).describe('Status').optional(),
    PackagingFilter: z.array(FilterIdSchema).describe('Packaging').optional(),
    MarketPlaceFilter: z.enum([
        "NoFilter",
        "ExcludeMarketPlace",
        "MarketPlaceOnly"
    ]).describe('MarketPlaceFilter').optional(),
    SeriesFilter: z.array(FilterIdSchema).describe('SeriesFilter').optional(),
    MinimumQuantityAvailable: z.number().int().describe('The MinimumQuantityAvailable for the result to display').optional(),
    ParameterFilterRequest: ParameterFilterRequestSchema.optional(),
    SearchOptions: z.array(z.enum([
        "ChipOutpost",
        "Has3DModel",
        "HasCadModel",
        "HasDatasheet",
        "HasProductPhoto",
        "InStock",
        "NewProduct",
        "NonRohsCompliant",
        "NormallyStocking",
        "RohsCompliant"
    ])).describe('/SearchOptions').optional(),
});

export const KeywordRequestSchema = z.object({
    Keywords: z.string().describe('A String of Keywords, up to 250 characters').optional(),
    Limit: z.number().int().describe('Number of products to return between 1 and 50.').optional(),
    Offset: z.number().int().describe('The starting index of the records returned. This is used to paginate beyond RecordCount number of results.').optional(),
    FilterOptionsRequest: FilterOptionsRequestSchema.optional(),
    SortOptions: SortOptionsSchema.optional()
});

// Define Zod schema for the /search/keyword POST request body
export const KeywordSearchSchema = z.object({
    body: KeywordRequestSchema.optional(),
    includes: z.string().optional(),
    headers: z.object({
        Authorization: z.string().describe('OAuth Bearer Token. Please see<a href= "https://developer.digikey.com/documentation/oauth" target= "_blank" > OAuth 2.0 Documentation </a> page for more info.').optional(),
        'X-DIGIKEY-Client-Id': z.string().describe('The CliendId for your app.'),
        'X-DIGIKEY-Locale-Language': z.string().describe('Two letter code for language to search on. Langauge must be supported by the selected site. If searching on keyword, this language is used to find matches. Acceptable values include: en, ja, de, fr, ko, zhs, zht, it, es, he, nl, sv, pl, fi, da, no.\nDefault value: en').optional(),
        'X-DIGIKEY-Locale-Currency': z.string().describe('Three letter code for Currency to return part pricing for. Currency must be supported by the selected site. Acceptable values include: USD, CAD, JPY, GBP, EUR, HKD, SGD, TWD, KRW, AUD, NZD, INR, DKK, NOK, SEK, ILS, CNY, PLN, CHF, CZK, HUF, RON, ZAR, MYR, THB, PHP.\nDefault value: primary currency for the entered Locale-site.').optional(),
        'X-DIGIKEY-Locale-Site': z.string().describe('Two letter code for Digi-Key product website to search on. Different countries sites have different part restrictions, supported languages, and currencies. Acceptable values include: US, CA, JP, UK, DE, AT, BE, DK, FI, GR, IE, IT, LU, NL, NO, PT, ES, KR, HK, SG, CN, TW, AU, FR, IN, NZ, SE, MX, CH, IL, PL, SK, SI, LV, LT, EE, CZ, HU, BG, MY, ZA, RO, TH, PH.\nDefault value: US').optional(),
        'X-DIGIKEY-Customer-Id': z.string().describe('Your Digi-Key Customer id. If your account has multiple Customer Ids for different regions, this allows you to select one of them.').optional(),
    }),
});

// output schema for part search
const BaseFilterV4Schema = z.object({
    Id: z.number().int().optional(),
    Value: z.string().optional(),
    ProductCount: z.number().int().optional(),
});

const ManufacturerSchema = z.object({
    Id: z.number().int().describe('Manufacturer Id').optional(),
    Name: z.string().describe('Manufacturer Name').optional(),
});
const CategoryNodeSchema = z.object({
    CategoryId: z.number().int().describe('The Category Id').optional(),
    ParentId: z.number().int().describe('If this is a child category, this is the Id of the parent category').optional(),
    Name: z.string().describe('Category name').optional(),
    ProductCount: z.number().int().describe('The number of products in the category').optional(),
    NewProductCount: z.number().int().describe('The number of new products in the category').optional(),
    ImageUrl: z.string().describe('The URL of the image of the category').optional(),
    SeoDescription: z.string().describe('The SEO description for the category').optional(),
    ChildCategories: z.array(z.any()).describe('A list of all children of the category - Their parent Id will be Category Id').optional(), // Assuming recursive structure, using z.lazy
});

const SeriesSchema = z.object({
  Id: z.number().int().describe('Series Id').optional(),
  Name: z.string().describe('Series Name').optional()
});

const ClassificationsSchema = z.object({
    ReachStatus: z.string().describe('ReachStatus').optional(),
    RohsStatus: z.string().describe('RohsStatus').optional(),
    MoistureSensitivityLevel: z.string().describe('Code for Moisture Sensitivity Level of the product').optional(),
    ExportControlClassNumber: z.string().describe('Export control class number. See documentation from the U.S. Department of Commerce.').optional(),
    HtsusCode: z.string().describe('Harmonized Tariff Schedule of the United States. See documentation from the U.S. International Trade Commission.').optional(),
});
const BaseProductSchema = z.object({
    Id: z.number().int().describe('Manufacturer Id').optional(),
    Name: z.string().describe('Manufacturer Name').optional(),
});

const PackageTypeSchema = z.object({
    Id: z.number().int().describe('PackageType Id').optional(),
    Name: z.string().describe('PackageType Name').optional(),
});

const PriceBreakSchema = z.object({
    BreakQuantity: z.number().int().describe('The quantity at which the price takes effect').optional(),
    UnitPrice: z.number().describe('The unit price for the quantity').optional(),
    TotalPrice: z.number().describe('The total price').optional(),
});

const ProductStatusV4Schema = z.object({
    Id: z.number().int().optional(),
    Status: z.string().optional()
});

const ParameterValueSchema = z.object({
    ParameterId: z.number().int().describe('Parameter Id').optional(),
    ParameterText: z.string().describe('Parameter Text').optional(),
    ParameterType: z.enum([
        "String",
        "Integer",
        "Double",
        "UnitOfMeasure",
        "CoupledUnitOfMeasure",
        "RangeUnitOfMeasure"
    ]).describe('Parameter Data Type').optional(),
    ValueId: z.string().describe('The Id of the Parameter value').optional(),
    ValueText: z.string().describe('The text of the Parameter value').optional(),
});
const DescriptionSchema = z.object({
  ProductDescription: z.string().describe("Description of the product. If you entered a valid Locale and Language in the input, we will return the description in that language. Otherwise, we’ll return the English description.").optional(),
  DetailedDescription: z.string().describe("Detailed description of the product. If you entered a valid Locale and Language in the input, we will return the description in that language. Otherwise, we’ll return the English description.").optional()
});

const ProductVariationSchema = z.object({
    DigiKeyProductNumber: z.string().describe('DigiKey Product number of the variation').optional(),
    PackageType: PackageTypeSchema.optional(),
    StandardPricing: z.array(PriceBreakSchema).describe('Standard pricing for the validated locale.').optional(),
    MyPricing: z.array(PriceBreakSchema).describe('Your pricing for the account with which you authenticated. Also dependent on locale information.').optional(),
    MarketPlace: z.boolean().describe('Product is a Marketplace product that ships direct from the supplier. A separate shipping fee may apply').optional(),
    TariffActive: z.boolean().describe('Indicates if there is a tariff on the item.').optional(),
    Supplier: z.object({
      Id: z.number().int().describe('Supplier Id').optional(),
      Name: z.string().describe('Supplier Name').optional()
    }).optional(),
    QuantityAvailableforPackageType: z.number().int().describe('The quantity available for the specified variation.').optional(),
    MaxQuantityForDistribution: z.number().int().describe('Maximum order quantity for Distribution').optional(),
    MinimumOrderQuantity: z.number().int().describe('The Minimum Order Quantity').optional(),
    StandardPackage: z.number().int().describe("The number of products in the manufacturer's standard package.").optional(),
    DigiReelFee: z.number().describe('Fee per reel ordered.').optional(),
});
export const ProductSchema = z.object({
    Description: DescriptionSchema.optional(),
    Manufacturer: ManufacturerSchema.optional(),
    ManufacturerProductNumber: z.string().describe('The manufacturer part number. Note that some manufacturer part numbers may be used by multiple manufacturers for different parts.').optional(),
    UnitPrice: z.number().describe('The price for a single unit of this product.').optional(),
    ProductUrl: z.string().describe('Full URL of the Digi-Key catalog page to purchase the product (e.g. "https://www.digikey.com/product-detail/en/keystone-electronics/117/36-117-ND/7385294"). This is based on your provided Locale values.').optional(),
    DatasheetUrl: z.string().describe("The URL to the product's datasheet.").optional(),
    PhotoUrl: z.string().describe("The URL to the product's image.").optional(),
    ProductVariations: z.array(ProductVariationSchema).optional(),
    QuantityAvailable: z.number().int().describe('The sum of the quantity for all package types that are found in ProductVariations.').optional(),
    ProductStatus: ProductStatusV4Schema.optional(),
    BackOrderNotAllowed: z.boolean().describe('True if back order is not allowed for this product').optional(),
    NormallyStocking: z.boolean().describe('Indicates if a product is normally stocked.').optional(),
    Discontinued: z.boolean().describe('This product is no longer sold at Digi-Key and will no longer be stocked.').optional(),
    EndOfLife: z.boolean().describe('This product is no longer manufactured and will no longer be stocked once stock is depleted.').optional(),
    Ncnr: z.boolean().describe('Is product non-cancellable and non-returnable').optional(),
    PrimaryVideoUrl: z.string().describe("The URL to the product's video").optional(),
    Parameters: z.array(ParameterValueSchema).optional(),
    BaseProductNumber: BaseProductSchema.optional(),
    Category: CategoryNodeSchema.optional(),
    DateLastBuyChance: z.string().datetime().describe('Last date that the product will be available for purchase. Date is in ISO 8601.').optional(),
    ManufacturerLeadWeeks: z.string().describe('The number of weeks expected to receive stock from manufacturer.').optional(),
    ManufacturerPublicQuantity: z.number().int().describe('Quantity of this product available to order from manufacturer.').optional(),
    Series: SeriesSchema.optional(),
    ShippingInfo: z.string().describe('Additional shipping information - if available').optional(),
    Classifications: ClassificationsSchema.optional(),
});

const FilterValueSchema = z.object({
    ProductCount: z.number().int().describe('Number of products with this filter').optional(),
    ValueId: z.string().describe('Filter Value Id').optional(),
    ValueName: z.string().describe('Filter Value Name').optional(),
    RangeFilterType: z.enum([
        "Min",
        "Max",
        "Range"
    ]).describe('Filter Range - possible values: Min, Max, Range').optional()
});

const ParameterFilterOptionsResponseSchema = z.object({
  Category: BaseFilterV4Schema.optional(),
  ParameterType: z.string().describe("Parameter Type").optional(),
  ParameterId: z.number().int().describe("Parameter Id").optional(),
  ParameterName: z.string().describe("Parameter Name").optional(),
  FilterValues: z.array(FilterValueSchema).describe("List of Filter Values for the Parameter").optional()
});
const TopCategoryNodeSchema = z.object({
    Id: z.number().int().describe('Category Id').optional(),
    Name: z.string().describe('Category Name').optional(),
    ProductCount: z.number().int().describe('Product count for the Category').optional(),
});

const TopCategorySchema = z.object({
    RootCategory: TopCategoryNodeSchema.optional(),
    Category: TopCategoryNodeSchema.optional(),
    Score: z.number().describe('Category Score').optional(),
    ImageUrl: z.string().describe('URL for the Category image').optional(),
});
const FilterOptionsSchema = z.object({
    Manufacturers: z.array(BaseFilterV4Schema).describe('The Manufacturers that can be filtered to narrow next search request').optional(),
    Packaging: z.array(BaseFilterV4Schema).describe('Packaging that can be filtered to narrow next search request').optional(),
    Status: z.array(BaseFilterV4Schema).describe('Status that can be filtered to narrow next search request').optional(),
    Series: z.array(BaseFilterV4Schema).describe('Series that can be filtered to narrow next search request').optional(),
    ParametricFilters: z.array(ParameterFilterOptionsResponseSchema).describe('ParaetricFilter that can be filtered to narrow next search request').optional(),
    TopCategories: z.array(TopCategorySchema).describe('the top Categories to filter').optional(),
    MarketPlaceFilters: z.array(z.enum([
        "NoFilter",
        "ExcludeMarketPlace",
        "MarketPlaceOnly"
    ])).describe('Marketplace Filter').optional(),
});

const IsoSearchLocaleSchema = z.object({
    Site: z.string().describe('The site we used for the API call (e.g. "US"). Note this may be different than the value you entered if that value was not one of our allowed values.').optional(),
    Language: z.string().describe('The language we used for the API call (e.g. "en"). Note this may be different than the value you entered if that value was not one of our allowed values or not valid for the entered site.').optional(),
    Currency: z.string().describe('The currency we used for the API call (e.g. "USD"). Note this may be different than the value you entered if that value was not one of our allowed values or not valid for the entered site.').optional(),
});
const AppliedParametricFiltersDtoSchema = z.object({
  Id: z.number().int().describe("Parameter Id").optional(),
  Text: z.string().describe("Parameter Description").optional(),
  Priority: z.number().int().describe("Parameter priority").optional()
});

export const ProductList = z.array(ProductSchema)

// Define Zod schema for KeywordResponse
export const KeywordResponseSchema = z.object({
    Products: z.array(ProductSchema).optional(),
    ProductsCount: z.number().int().describe('Total number of matching products found.').optional(),
    ExactMatches: z.array(ProductSchema).optional(),
    FilterOptions: FilterOptionsSchema.optional(),
    SearchLocaleUsed: IsoSearchLocaleSchema.optional(),
    AppliedParametricFiltersDto: z.array(AppliedParametricFiltersDtoSchema).optional()
});

export const KeyWordResponseJsonSchema = `
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "KeywordResponse",
    "type": "object",
    "properties": {
        "Products": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/Product"
            }
        },
        "ProductsCount": {
            "type": "integer",
            "format": "int32",
            "description": "Total number of matching products found.",
            "example": 6463
        },
        "ExactMatches": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/Product"
            }
        },
        "FilterOptions": {
            "$ref": "#/definitions/FilterOptions"
        },
        "SearchLocaleUsed": {
            "$ref": "#/definitions/IsoSearchLocale"
        },
        "AppliedParametricFiltersDto": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/Parameter"
            }
        }
    },
    "additionalProperties": false,
    "definitions": {
        "Product": {
            "type": "object",
            "properties": {
                "Description": {
                    "$ref": "#/definitions/Description"
                },
                "Manufacturer": {
                    "$ref": "#/definitions/Manufacturer"
                },
                "ManufacturerProductNumber": {
                    "type": "string",
                    "description": "The manufacturer part number. Note that some manufacturer part numbers may be used by multiple manufacturers for different parts."
                },
                "UnitPrice": {
                    "type": "number",
                    "format": "double",
                    "description": "The price for a single unit of this product."
                },
                "ProductUrl": {
                    "type": "string",
                    "description": "Full URL of the Digi-Key catalog page to purchase the product. This is based on your provided Locale values.",
                    "example": "https://www.digikey.com/product-detail/en/keystone-electronics/117/36-117-ND/7385294"
                },
                "DatasheetUrl": {
                    "type": "string",
                    "description": "The URL to the product's datasheet."
                },
                "PhotoUrl": {
                    "type": "string",
                    "description": "The URL to the product's image."
                },
                "ProductVariations": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/ProductVariation"
                    }
                },
                "QuantityAvailable": {
                    "type": "integer",
                    "format": "int64",
                    "description": "The sum of the quantity for all package types that are found in ProductVariations."
                },
                "ProductStatus": {
                    "$ref": "#/definitions/ProductStatusV4"
                },
                "BackOrderNotAllowed": {
                    "type": "boolean",
                    "description": "True if back order is not allowed for this product"
                },
                "NormallyStocking": {
                    "type": "boolean",
                    "description": "Indicates if a product is normally stocked."
                },
                "Discontinued": {
                    "type": "boolean",
                    "description": "This product is no longer sold at Digi-Key and will no longer be stocked."
                },
                "EndOfLife": {
                    "type": "boolean",
                    "description": "This product is no longer manufactured and will no longer be stocked once stock is depleted."
                },
                "Ncnr": {
                    "type": "boolean",
                    "description": "Is product non-cancellable and non-returnable"
                },
                "PrimaryVideoUrl": {
                    "type": "string",
                    "description": "The URL to the product's video"
                },
                "Parameters": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/ParameterValue"
                    }
                },
                "BaseProductNumber": {
                    "$ref": "#/definitions/BaseProduct"
                },
                "Category": {
                    "$ref": "#/definitions/CategoryNode"
                },
                "DateLastBuyChance": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Last date that the product will be available for purchase. Date is in ISO 8601."
                },
                "ManufacturerLeadWeeks": {
                    "type": "string",
                    "description": "The number of weeks expected to receive stock from manufacturer."
                },
                "ManufacturerPublicQuantity": {
                    "type": "integer",
                    "format": "int32",
                    "description": "Quantity of this product available to order from manufacturer."
                },
                "Series": {
                    "$ref": "#/definitions/Series"
                },
                "ShippingInfo": {
                    "type": "string",
                    "description": "Additional shipping information - if available"
                },
                "Classifications": {
                    "$ref": "#/definitions/Classifications"
                }
            },
            "additionalProperties": false
        },
        "Description": {
            "type": "object",
            "properties": {
                "ProductDescription": {
                    "type": "string",
                    "description": "Description of the product. If you entered a valid Locale and Language in the input, we will return the description in that language. Otherwise, we’ll return the English description."
                },
                "DetailedDescription": {
                    "type": "string",
                    "description": "Detailed description of the product. If you entered a valid Locale and Language in the input, we will return the description in that language. Otherwise, we’ll return the English description."
                }
            },
            "additionalProperties": false
        },
        "Manufacturer": {
            "type": "object",
            "properties": {
                "Id": {
                    "type": "integer",
                    "format": "int32",
                    "description": "Manufacturer Id"
                },
                "Name": {
                    "type": "string",
                    "description": "Manufacturer Name"
                }
            },
            "additionalProperties": false
        },
        "ProductVariation": {
            "type": "object",
            "properties": {
                "DigiKeyProductNumber": {
                    "type": "string",
                    "description": "DigiKey Product number of the variation"
                },
                "PackageType": {
                    "$ref": "#/definitions/PackageType"
                },
                "StandardPricing": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/PriceBreak"
                    },
                    "description": "Standard pricing for the validated locale."
                },
                "MyPricing": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/PriceBreak"
                    },
                    "description": "Your pricing for the account with which you authenticated. Also dependent on locale information."
                },
                "MarketPlace": {
                    "type": "boolean",
                    "description": "Product is a Marketplace product that ships direct from the supplier. A separate shipping fee may apply"
                },
                "TariffActive": {
                    "type": "boolean",
                    "description": "Indicates if there is a tariff on the item."
                },
                "Supplier": {
                    "$ref": "#/definitions/Supplier"
                },
                "QuantityAvailableforPackageType": {
                    "type": "integer",
                    "format": "int32",
                    "description": "The quantity available for the specified variation."
                },
                "MaxQuantityForDistribution": {
                    "type": "integer",
                    "format": "int64",
                    "description": "Maximum order quantity for Distribution"
                },
                "MinimumOrderQuantity": {
                    "type": "integer",
                    "format": "int32",
                    "description": "The Minimum Order Quantity"
                },
                "StandardPackage": {
                    "type": "integer",
                    "format": "int32",
                    "description": "The number of products in the manufacturer's standard package."
                },
                "DigiReelFee": {
                    "type": "number",
                    "format": "double",
                    "description": "Fee per reel ordered."
                }
            },
            "additionalProperties": false
        },
        "PackageType": {
            "type": "object",
            "properties": {
                "Id": {
                    "type": "integer",
                    "format": "int32",
                    "description": "PackageType Id"
                },
                "Name": {
                    "type": "string",
                    "description": "PackageType Name"
                }
            },
            "additionalProperties": false
        },
        "PriceBreak": {
            "type": "object",
            "properties": {
                "BreakQuantity": {
                    "type": "integer",
                    "format": "int32",
                    "description": "The quantity at which the price takes effect"
                },
                "UnitPrice": {
                    "type": "number",
                    "format": "double",
                    "description": "The unit price for the quantity"
                },
                "TotalPrice": {
                    "type": "number",
                    "format": "double",
                    "description": "The total price"
                }
            },
            "additionalProperties": false
        },
        "Supplier": {
            "type": "object",
            "properties": {
                "Id": {
                    "type": "integer",
                    "format": "int32",
                    "description": "Supplier Id"
                },
                "Name": {
                    "type": "string",
                    "description": "Supplier Name"
                }
            },
            "additionalProperties": false
        },
        "ProductStatusV4": {
            "type": "object",
            "properties": {
                "Id": {
                    "type": "integer",
                    "format": "int32"
                },
                "Status": {
                    "type": "string"
                }
            },
            "additionalProperties": false
        },
        "ParameterValue": {
            "type": "object",
            "properties": {
                "ParameterId": {
                    "type": "integer",
                    "format": "int32",
                    "description": "Parameter Id"
                },
                "ParameterText": {
                    "type": "string",
                    "description": "Parameter Text"
                },
                "ParameterType": {
                    "type": "string",
                    "enum": [
                        "String",
                        "Integer",
                        "Double",
                        "UnitOfMeasure",
                        "CoupledUnitOfMeasure",
                        "RangeUnitOfMeasure"
                    ],
                    "description": "Parameter Data Type"
                },
                "ValueId": {
                    "type": "string",
                    "description": "The Id of the Parameter value"
                },
                "ValueText": {
                    "type": "string",
                    "description": "The text of the Parameter value"
                }
            },
            "additionalProperties": false
        },
        "BaseProduct": {
            "type": "object",
            "properties": {
                "Id": {
                    "type": "integer",
                    "format": "int32",
                    "description": "Manufacturer Id"
                },
                "Name": {
                    "type": "string",
                    "description": "Manufacturer Name"
                }
            },
            "additionalProperties": false
        },
        "CategoryNode": {
            "type": "object",
            "properties": {
                "CategoryId": {
                    "type": "integer",
                    "format": "int32",
                    "description": "The Category Id"
                },
                "ParentId": {
                    "type": "integer",
                    "format": "int32",
                    "description": "If this is a child category, this is the Id of the parent category"
                },
                "Name": {
                    "type": "string",
                    "description": "Category name"
                },
                "ProductCount": {
                    "type": "integer",
                    "format": "int64",
                    "description": "The number of products in the category"
                },
                "NewProductCount": {
                    "type": "integer",
                    "format": "int64",
                    "description": "The number of new products in the category"
                },
                "ImageUrl": {
                    "type": "string",
                    "description": "The URL of the image of the category"
                },
                "SeoDescription": {
                    "type": "string",
                    "description": "The SEO description for the category"
                },
                "ChildCategories": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/CategoryNode"
                    },
                    "description": "A list of all children of the category - Their parent Id will be Category Id"
                }
            },
            "additionalProperties": false
        },
        "Series": {
            "type": "object",
            "properties": {
                "Id": {
                    "type": "integer",
                    "format": "int32",
                    "description": "Series Id"
                },
                "Name": {
                    "type": "string",
                    "description": "Series Name"
                }
            },
            "additionalProperties": false
        },
        "Classifications": {
            "type": "object",
            "properties": {
                "ReachStatus": {
                    "type": "string",
                    "description": "ReachStatus"
                },
                "RohsStatus": {
                    "type": "string",
                    "description": "RohsStatus"
                },
                "MoistureSensitivityLevel": {
                    "type": "string",
                    "description": "Code for Moisture Sensitivity Level of the product"
                },
                "ExportControlClassNumber": {
                    "type": "string",
                    "description": "Export control class number. See documentation from the U.S. Department of Commerce."
                },
                "HtsusCode": {
                    "type": "string",
                    "description": "Harmonized Tariff Schedule of the United States. See documentation from the U.S. International Trade Commission."
                }
            },
            "additionalProperties": false
        },
        "FilterOptions": {
            "type": "object",
            "properties": {
                "Manufacturers": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/BaseFilterV4"
                    },
                    "description": "The Manufacturers that can be filtered to narrow next search request"
                },
                "Packaging": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/BaseFilterV4"
                    },
                    "description": "Packaging that can be filtered to narrow next search request"
                },
                "Status": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/BaseFilterV4"
                    },
                    "description": "Status that can be filtered to narrow next search request"
                },
                "Series": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/BaseFilterV4"
                    },
                    "description": "Series that can be filtered to narrow next search request"
                },
                "ParametricFilters": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/ParameterFilterOptionsResponse"
                    },
                    "description": "ParaetricFilter that can be filtered to narrow next search request"
                },
                "TopCategories": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/TopCategory"
                    },
                    "description": "the top Categories to filter"
                },
                "MarketPlaceFilters": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "enum": [
                            "NoFilter",
                            "ExcludeMarketPlace",
                            "MarketPlaceOnly"
                        ]
                    },
                    "description": "Marketplace Filter"
                }
            },
            "additionalProperties": false
        },
        "BaseFilterV4": {
            "type": "object",
            "properties": {
                "Id": {
                    "type": "string",
                    "description": "Filter Id"
                },
                "Name": {
                    "type": "string",
                    "description": "Filter Name"
                },
                "Count": {
                    "type": "integer",
                    "format": "int64",
                    "description": "Count of items matching filter"
                }
            },
            "additionalProperties": false
        },
        "ParameterFilterOptionsResponse": {
            "type": "object",
            "properties": {
                "Category": {
                    "$ref": "#/definitions/BaseFilterV4"
                },
                "ParameterType": {
                    "type": "string",
                    "description": "Parameter Type"
                },
                "ParameterId": {
                    "type": "integer",
                    "format": "int32",
                    "description": "Parameter Id"
                },
                "ParameterName": {
                    "type": "string",
                    "description": "Parameter Name"
                },
                "FilterValues": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/FilterValue"
                    },
                    "description": "List of Filter Values for the Parameter"
                }
            },
            "additionalProperties": false
        },
        "FilterValue": {
            "type": "object",
            "properties": {
                "ProductCount": {
                    "type": "integer",
                    "format": "int64",
                    "description": "Number of products with this filter"
                },
                "ValueId": {
                    "type": "string",
                    "description": "Filter Value Id"
                },
                "ValueName": {
                    "type": "string",
                    "description": "Filter Value Name"
                },
                "RangeFilterType": {
                    "type": "string",
                    "enum": [
                        "Min",
                        "Max",
                        "Range"
                    ],
                    "description": "Filter Range - possible values: Min, Max, Range"
                }
            },
            "additionalProperties": false
        },
        "TopCategory": {
            "type": "object",
            "properties": {
                "RootCategory": {
                    "$ref": "#/definitions/TopCategoryNode"
                },
                "Category": {
                    "$ref": "#/definitions/TopCategoryNode"
                },
                "Score": {
                    "type": "number",
                    "format": "double",
                    "description": "Category Score"
                },
                "ImageUrl": {
                    "type": "string",
                    "description": "URL for the Category image"
                }
            },
            "additionalProperties": false
        },
        "TopCategoryNode": {
            "type": "object",
            "properties": {
                "Id": {
                    "type": "integer",
                    "format": "int32",
                    "description": "Category Id"
                },
                "Name": {
                    "type": "string",
                    "description": "Category Name"
                },
                "ProductCount": {
                    "type": "integer",
                    "format": "int64",
                    "description": "Product count for the Category"
                }
            },
            "additionalProperties": false
        },
        "IsoSearchLocale": {
            "type": "object",
            "properties": {
                "Site": {
                    "type": "string",
                    "description": "The site we used for the API call. Note this may be different than the value you entered if that value was not one of our allowed values.",
                    "example": "US"
                },
                "Language": {
                    "type": "string",
                    "description": "The language we used for the API call. Note this may be different than the value you entered if that value was not one of our allowed values or not valid for the entered site.",
                    "example": "en"
                },
                "Currency": {
                    "type": "string",
                    "description": "The currency we used for the API call. Note this may be different than the value you entered if that value was not one of our allowed values or not valid for the entered site.",
                    "example": "USD"
                }
            },
            "additionalProperties": false
        },
        "Parameter": {
            "type": "object",
            "properties": {
                "Id": {
                    "type": "integer",
                    "format": "int32",
                    "description": "Parameter Id"
                },
                "Text": {
                    "type": "string",
                    "description": "Parameter Description"
                },
                "Priority": {
                    "type": "integer",
                    "format": "int32",
                    "description": "Parameter priority"
                }
            },
            "additionalProperties": false
        }
    }
}
`

export const productJsonSchema = `
{
  "type": "object",
  "properties": {
    "Description": {
      "$ref": "#/definitions/Description"
    },
    "Manufacturer": {
      "$ref": "#/definitions/Manufacturer"
    },
    "ManufacturerProductNumber": {
      "type": "string",
      "description": "The manufacturer part number. Note that some manufacturer part numbers may be used by multiple manufacturers for different parts."
    },
    "UnitPrice": {
      "type": "number",
      "format": "double",
      "description": "The price for a single unit of this product."
    },
    "ProductUrl": {
      "type": "string",
      "description": "Full URL of the Digi-Key catalog page to purchase the product. This is based on your provided Locale values.",
      "example": "https://www.digikey.com/product-detail/en/keystone-electronics/117/36-117-ND/7385294"
    },
    "DatasheetUrl": {
      "type": "string",
      "description": "The URL to the product's datasheet."
    },
    "PhotoUrl": {
      "type": "string",
      "description": "The URL to the product's image."
    },
    "ProductVariations": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/ProductVariation"
      }
    },
    "QuantityAvailable": {
      "type": "integer",
      "format": "int64",
      "description": "The sum of the quantity for all package types that are found in ProductVariations."
    },
    "ProductStatus": {
      "$ref": "#/definitions/ProductStatusV4"
    },
    "BackOrderNotAllowed": {
      "type": "boolean",
      "description": "True if back order is not allowed for this product"
    },
    "NormallyStocking": {
      "type": "boolean",
      "description": "Indicates if a product is normally stocked."
    },
    "Discontinued": {
      "type": "boolean",
      "description": "This product is no longer sold at Digi-Key and will no longer be stocked."
    },
    "EndOfLife": {
      "type": "boolean",
      "description": "This product is no longer manufactured and will no longer be stocked once stock is depleted."
    },
    "Ncnr": {
      "type": "boolean",
      "description": "Is product non-cancellable and non-returnable"
    },
    "PrimaryVideoUrl": {
      "type": "string",
      "description": "The URL to the product's video"
    },
    "Parameters": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/ParameterValue"
      }
    },
    "BaseProductNumber": {
      "$ref": "#/definitions/BaseProduct"
    },
    "Category": {
      "$ref": "#/definitions/CategoryNode"
    },
    "DateLastBuyChance": {
      "type": "string",
      "format": "date-time",
      "description": "Last date that the product will be available for purchase. Date is in ISO 8601."
    },
    "ManufacturerLeadWeeks": {
      "type": "string",
      "description": "The number of weeks expected to receive stock from manufacturer."
    },
    "ManufacturerPublicQuantity": {
      "type": "integer",
      "format": "int32",
      "description": "Quantity of this product available to order from manufacturer."
    },
    "Series": {
      "$ref": "#/definitions/Series"
    },
    "ShippingInfo": {
      "type": "string",
      "description": "Additional shipping information - if available"
    },
    "Classifications": {
      "$ref": "#/definitions/Classifications"
    }
  },
  "additionalProperties": false
}
`