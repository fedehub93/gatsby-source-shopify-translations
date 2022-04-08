const { gql } = require("@apollo/client")

exports.translatedProductsQuery = ids => {
  return {
    query: gql`
      query translatedThings($ids: [ID!]!) {
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
            metafields(first: 30) {
              edges {
                node {
                  id
                  key
                  value
                  description
                }
              }
            }
          }
        }
      }
    `,
    variables: {
      ids,
    },
  }
}

exports.translatedCollectionsQuery = ids => {
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
            image {
              id
              src
              width
              height
            }
          }
        }
      }
    `,
    variables: {
      ids,
    },
  }
}
