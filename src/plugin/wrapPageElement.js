import React from "react"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import { LocaleContext } from "../context"

const wrapPageElement = (
  { element, props },
  { locales, sourceOnlyMode, localeJsonNodeName = "locales" }
) => {
  if (!props || sourceOnlyMode) return
  const { data, pageContext } = props
  const { language, languages, originalPath, defaultLanguage, path } =
    pageContext

  const localeNodes = data?.[localeJsonNodeName]?.edges || []

  if (
    locales.length > 1 &&
    localeNodes.length === 0 &&
    process.env.NODE_ENV === "development"
  ) {
    console.error(`No translations were found in "${localeJsonNodeName}"
      You need to add a graphql query to every page like this:
        
        export const query = graphql\`
          query($language: String!) {
            ${localeJsonNodeName}: allLocale(language: {eq: $language}}) {
              edges {
                node {
                  ns
                  data
                  language
                }
              }
            }
          }
      \`;
    `)
  }

  const namespaces = localeNodes.map(({ node }) => node.ns)
  let defaultNS = "translation"
  const fallbackNS = namespaces.filter(ns => ns !== defaultNS)

  const resources = localeNodes.reduce((res, { node }) => {
    const parsedData = JSON.parse(node.data)
    if (!(node.language in res)) res[node.language] = {}

    res[node.language][node.ns] = parsedData

    return res
  }, {})

  i18n.use(initReactI18next).init({
    debug: process.env.NODE_ENV === "development",
    resources,
    lng: language,
    fallbackLng: "en",
    fallbackNS,
    react: {
      useSuspense: true,
    },
  })

  if (i18n.language !== language) {
    i18n.changeLanguage(language)
  }

  const context = {
    language,
    languages,
    originalPath,
    defaultLanguage,
    path,
  }

  return (
    <LocaleContext.Provider value={context}>{element}</LocaleContext.Provider>
  )
}

export { wrapPageElement }
