const { createOperations } = require("./operations")

const SHOPIFY_PRODUCT = `ShopifyProduct`
const SHOPIFY_COLLECTION = `ShopifyCollection`

const SHOPIFY_TRANSLATED_PRODUCT = `ShopifyTranslatedProduct`
const SHOPIFY_TRANSLATED_COLLECTION = `ShopifyTranslatedCollection`

exports.resources = [
  {
    id: `Product`,
    nodeType: SHOPIFY_PRODUCT,
    translationsNodeType: SHOPIFY_TRANSLATED_PRODUCT,
    getOperation: (pluginOptions, lang) => {
      const { createTranslatedProductsOperation } = createOperations({
        ...pluginOptions,
        language: lang,
      })
      return createTranslatedProductsOperation
    },
  },
  {
    id: `Collection`,
    nodeType: SHOPIFY_COLLECTION,
    translationsNodeType: SHOPIFY_TRANSLATED_COLLECTION,
    getOperation: (pluginOptions, lang) => {
      const { createTranslatedCollectionsOperation } = createOperations({
        ...pluginOptions,
        language: lang,
      })
      return createTranslatedCollectionsOperation
    },
  },
]
