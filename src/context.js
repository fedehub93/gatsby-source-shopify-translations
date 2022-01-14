import React, { createContext } from "react"
import i18n from "./i18n"
import { defaultLang } from "./utils/default-options"

const LocaleContext = createContext(defaultLang)

const LocaleProvider = ({
  children,
  pageContext: { locale = defaultLang },
}) => {
  if (i18n.language !== locale) i18n.changeLanguage(locale)
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  )
}

export { LocaleContext, LocaleProvider }
