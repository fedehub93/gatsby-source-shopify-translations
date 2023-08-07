const { gql } = require("@apollo/client")

exports.translatedProductsQuery = (ids, identifiers) => {
  return {
    query: gql`
      query translatedThings(
        $ids: [ID!]!
        $identifiers: [HasMetafieldsIdentifier!]!
      ) {
        nodes(ids: $ids) {
          ... on Product {
            __typename
            id
            title
            description
            descriptionHtml
            handle
            productType
            collections(first: 10) {
              edges {
                node {
                  id
                  title
                }
              }
            }
            options {
              __typename
              name
              values
            }
            variants(first: 30) {
              edges {
                node {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            metafields(identifiers: $identifiers) {
              key
              value
              namespace
            }
          }
        }
      }
    `,
    variables: {
      ids,
      identifiers,
    },
  }
}

exports.translatedCollectionsQuery = (ids) => {
  return {
    query: gql`
      query translatedThings($ids: [ID!]!) {
        nodes(ids: $ids) {
          ... on Collection {
            __typename
            id
            title
            description
            descriptionHtml
            handle
          }
        }
      }
    `,
    variables: {
      ids,
    },
  }
}
