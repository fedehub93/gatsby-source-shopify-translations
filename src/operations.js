const { createClient } = require("./create-client")
const {
  translatedProductsQuery,
  translatedCollectionsQuery,
} = require("./queries")

exports.createOperations = options => {
  const client = createClient(options)

  async function createOperation(operationQuery) {
    return await client.query(operationQuery)
  }

  return {
    createTranslatedProductsOperation: async (ids, identifiers) => {
      return await createOperation(
        translatedProductsQuery(ids, identifiers),
        "TRANSLATED_PRODUCTS"
      )
    },
    createTranslatedCollectionsOperation: async (ids, identifiers) => {
      return await createOperation(
        translatedCollectionsQuery(ids, identifiers),
        "TRANSLATED_COLLECTIONS"
      )
    },
  }
}
