import { useContext } from "react"
import { defaultLang, withDefaults } from "../utils/default-options"
import { LocaleContext } from "../context"
import { localizedPath } from "../helpers"

export const useLocalization = () => {
  const {language, defaultLang} = useContext(LocaleContext)
  const config = withDefaults()

  return {
    language,
    defaultLang,
    prefixDefault: config.prefixDefault,
    localizedPath,
  }
}
