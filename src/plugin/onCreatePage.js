const { localizedPath, getLanguages } = require(`../helpers`)
const { withDefaults } = require(`../utils/default-options`)

exports.onCreatePage = ({ page, actions }, pluginOptions) => {
  if (pluginOptions.sourceOnlyMode) return
  const { createPage, deletePage, createRedirect } = actions
  const { configPath, defaultLang, locales, prefixDefault } =
    withDefaults(pluginOptions)

  const isEnvDevelopment = process.env.NODE_ENV === "development"

  const configLocales = require(configPath)
  const languages = getLanguages({
    locales: configLocales,
    localeStr: locales,
  })

  // Exclude all pages yet translated
  const pageLocale = page.path.match(/^\/(.*?)\//)
  if (pageLocale && pageLocale[1]) {
    if (locales.includes(pageLocale[1])) {
      deletePage(page)

      const locale = languages.find(lang => lang.code === page.context.locale)
      
      const newPage = {
        ...page,
        context: {
          ...page.context,
          language: locale.code,
          languages: languages,
          defaultLanguage: defaultLang,
          hrefLang: locale.hrefLang,
          dateFormat: locale.dateFormat,
        },
      }
      createPage(newPage)
      return
    }
  }

  const originalPath = page.path

  // If 404 page I don't delete or home
  if (page.path.indexOf("404") === -1 && page.path !== "/") {
    deletePage(page)
  } else {
    deletePage(page)
    const newPage = {
      ...page,
      context: {
        ...page.context,
        languages: languages,
        defaultLanguage: defaultLang,
        originalPath,
      },
    }
    createPage(newPage)
  }

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
        language: locale.code,
        languages: languages,
        defaultLanguage: defaultLang,
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
