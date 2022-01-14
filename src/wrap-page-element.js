import React from "react"
import { LocaleProvider } from "./context"

const wrapPageElement = ({ element, props }) => {
  return (
    <LocaleProvider pageContext={props.pageContext}>{element}</LocaleProvider>
  )
}

export { wrapPageElement }
