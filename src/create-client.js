const { ApolloClient, InMemoryCache, HttpLink } = require("@apollo/client")
const fetch = require("node-fetch")

exports.createClient = ({
  shopName,
  accessToken,
  apiVersion = "2021-10",
  language,
}) => {
  const url = `https://${shopName}/api/${apiVersion}/graphql.json`

  return new ApolloClient({
    link: new HttpLink({
      uri: url,
      headers: {
        "X-Shopify-Storefront-Access-Token": accessToken,
        "Accept-Language": language,
      },
      fetch,
    }),
    cache: new InMemoryCache(),
  })
}
