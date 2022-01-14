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
    createTranslatedProductsOperation: async ids => {
      return await createOperation(
        translatedProductsQuery(ids),
        "TRANSLATED_PRODUCTS"
      )
    },
    createTranslatedCollectionsOperation: async ids => {
      return await createOperation(
        translatedCollectionsQuery(ids),
        "TRANSLATED_COLLECTIONS"
      )
    },
  }
}
