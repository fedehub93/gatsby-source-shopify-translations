const slugify = require("@sindresorhus/slugify")
const { resources } = require("../resources")

async function sourceAllNodes(gatsbyApi, pluginOptions) {
  const { locales } = pluginOptions

  const {
    actions,
    createContentDigest,
    createNodeId,
    getNodesByType,
    reporter,
  } = gatsbyApi

  const { createNode } = actions

  for (const resource of resources) {
    let translations = []

    for (const lang of locales) {
      const op = resource.getOperation(pluginOptions, lang)

      const resourceNodes = getNodesByType(resource.nodeType)
      const ids = resourceNodes.map(node => node.shopifyId)
      const { data } = await op(ids)
      const newTranslations = data.nodes
        .filter(node => !!node)
        .map(node => {
          return {
            ...node,
            handle: slugify(node.title),
            storefrontId: node.id,
            locale: lang,
          }
        })

      translations = [...translations, ...newTranslations]
    }

    reporter.info(
      `Fetching translated resources type ${resource.translationsNodeType}: ${translations.length}`
    )

    translations.forEach(node =>
      createNode({
        ...node,
        id: createNodeId(
          `${resource.translationsNodeType}-${node.id}-${node.locale}`
        ),
        parent: null,
        children: [],
        internal: {
          type: resource.translationsNodeType,
          content: JSON.stringify(node),
          contentDigest: createContentDigest(node),
        },
      })
    )
  }
}

exports.sourceNodes = async (gatsbyApi, pluginOptions) => {
  if (
    !pluginOptions.shopName ||
    !pluginOptions.shopifyPassword ||
    !pluginOptions.accessToken
  ) {
    console.log(
      "\nMissing configurations - shopName, shopifyAccessToken and yotpoAppKey are required"
    )
    process.exit(1)
  }

  await sourceAllNodes(gatsbyApi, pluginOptions)

  return
}
