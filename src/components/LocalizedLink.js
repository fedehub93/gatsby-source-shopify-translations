import React, { forwardRef } from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"

import { localizedPath } from "../helpers"
import { useLocalization } from "../hooks/useLocalization"

export const LocalizedLink = forwardRef(({ to, lang, ...props }, ref) => {
  const { defaultLang, prefixDefault, language } = useLocalization()
  const linkLocale = lang || language
  return (
    <Link
      {...props}
      ref={ref}
      to={localizedPath({
        defaultLang,
        prefixDefault,
        locale: linkLocale,
        path: to,
      })}
    />
  )
})

LocalizedLink.propTypes = {
  to: PropTypes.string.isRequired,
  lang: PropTypes.string,
}
