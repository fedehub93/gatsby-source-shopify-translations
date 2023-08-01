const slugify = require("@sindresorhus/slugify")
const { resources } = require("../resources")

const MAX_INPUT_RANGE = 250

function wait(ms, value) {
  return new Promise(resolve => setTimeout(resolve, ms, value))
}

async function waitShopifyNodes(
  getNodesByType,
  resource,
  waitingGatsbySourceShopify
) {
  const resourceNodes = getNodesByType(resource.nodeType)
  if (resourceNodes.length === 0) {
    await wait(waitingGatsbySourceShopify)
    return waitShopifyNodes(
      getNodesByType,
      resource,
      waitingGatsbySourceShopify
    )
  }
  return resourceNodes
}

async function sourceAllNodes(gatsbyApi, pluginOptions) {
  const { locales, waitingGatsbySourceShopify = 5000 } = pluginOptions

  const {
    actions,
    createContentDigest,
    createNodeId,
    getNodesByType,
    reporter,
  } = gatsbyApi

  const { createNode } = actions

  for (const resource of resources) {
    const metafieldIdentifiers = getNodesByType(
      `Shopify${resource.id}Metafield`
    )
      .map((metafield) => {
        const identifier = {
          namespace: metafield.namespace,
          key: metafield.key,
        };
        return identifier;
      })
      .filter(
        (v, i, a) =>
          a.findIndex((t) => JSON.stringify(t) === JSON.stringify(v)) === i
      );

    let translations = [];

    for (const lang of locales) {
      const op = resource.getOperation(pluginOptions, lang)

      const resourceNodes = await waitShopifyNodes(
        getNodesByType,
        resource,
        waitingGatsbySourceShopify
      )
      const ids = resourceNodes.map(node => node.shopifyId)

      const callNumbers = Math.ceil(ids.length / MAX_INPUT_RANGE)

      for (let i = 0; i < callNumbers; i++) {
        const idsTranch = ids.splice(0, MAX_INPUT_RANGE)
        const { data } = await op(idsTranch,metafieldIdentifiers)
        const newTranslations = data.nodes
        .filter(node => !!node)
        .map(node => {
          return {
              ...node,
              metafields: node.metafields
              ? node.metafields.filter((metafield) => metafield)
              : [],
              handle: slugify(node.title),
              storefrontId: node.id,
              locale: lang,
            }
          })
        translations = [...translations, ...newTranslations]
      }
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
      "\nMissing configurations - shopName, shopifyPassword and shopifyAccessToken are required"
    )
    process.exit(1)
  }

  await sourceAllNodes(gatsbyApi, pluginOptions)

  return
}
