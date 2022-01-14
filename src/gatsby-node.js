// constants for your GraphQL Post and Author types
const fs = require("fs-extra")
const path = require("path")

const slugify = require("@sindresorhus/slugify")
const { resources } = require("./resources")
const { withDefaults } = require(`./utils/default-options`)
const { localizedPath, getLanguages } = require(`./helpers`)
const { createSchemaCustomization } = require("./create-schema-customization")


exports.onPostBuild = () => {
  console.log("Copying locales", __dirname)
  fs.copySync(
    path.join(__dirname, "..", "..", "/i18n"),
    path.join(__dirname, "..", "..", "/public/locales")
  )
}

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

exports.createSchemaCustomization = createSchemaCustomization

exports.sourceNodes = async (gatsbyApi, pluginOptions) => {
  const { actions, createContentDigest, createNodeId } = gatsbyApi
  const { createNode } = actions

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

  const options = withDefaults(pluginOptions)
  const config = require(options.configPath)

  const configNode = {
    ...options,
    config,
  }

  createNode({
    ...configNode,
    id: createNodeId(`gatsby-i18n-config`),
    parent: null,
    children: [],
    internal: {
      type: `I18N`,
      contentDigest: createContentDigest(configNode),
      content: JSON.stringify(configNode),
      description: `Options for i18n`,
    },
  })

  await sourceAllNodes(gatsbyApi, pluginOptions)

  return
}

exports.onCreatePage = ({ page, actions }, pluginOptions) => {
  const { createPage, deletePage, createRedirect } = actions
  const { configPath, defaultLang, locales, prefixDefault } =
    withDefaults(pluginOptions)

  const isEnvDevelopment = process.env.NODE_ENV === "development"

  // Exclude all pages yet translated
  const pageLocale = page.path.match(/^\/(.*?)\//)
  if (pageLocale && pageLocale[1]) {
    if (locales.includes(pageLocale[1])) return
  }

  const originalPath = page.path

  // If 404 page I don't delete
  if (page.path.indexOf("404") === -1 && page.path !== "/") {
    deletePage(page)
  }

  const configLocales = require(configPath)
  const languages = getLanguages({
    locales: configLocales,
    localeStr: locales,
  })

  // Exclude product page  exit
  if (page.context?.isAlreadyTranslated) {
    languages.forEach(locale => {
      createRedirect({
        fromPath: originalPath,
        toPath: `/${locale.code}${originalPath}`,
        Language: locale.code,
        isPermanent: false,
        redirectInBrowser: isEnvDevelopment,
        statusCode: 301,
      })
    })
    return
  }

  languages.forEach(locale => {
    // If page defined in config file I use that path
    let newPath = originalPath
    const pageUrl = locale.pages.find(
      page => page.originalPath === originalPath
    )
    if (pageUrl) {
      newPath = pageUrl.path
    }

    const newPage = {
      ...page,
      path: localizedPath({
        defaultLang,
        prefixDefault,
        locale: locale.code,
        path: newPath,
      }),
      matchPath: page.matchPath
        ? localizedPath({
            defaultLang,
            prefixDefault,
            locale: locale.code,
            path: page.matchPath,
          })
        : page.matchPath,
      context: {
        ...page.context,
        locale: locale.code,
        hrefLang: locale.hrefLang,
        originalPath,
        dateFormat: locale.dateFormat,
      },
    }

    // Check if the page is a localized 404
    if (newPage.path.match(/^\/[a-z]{2}\/404\/$/)) {
      // Match all paths starting with this code (apart from other valid paths)
      newPage.matchPath = `/${locale.code}/*`
    }

    // If 404 I don't redirect
    if (page.path.indexOf("404") === -1 && page.path !== "/") {
      createRedirect({
        fromPath: newPath,
        toPath: newPage.path,
        Language: locale.code,
        isPermanent: false,
        redirectInBrowser: isEnvDevelopment,
        statusCode: 301,
      })
    }

    createPage(newPage)
  })
}
