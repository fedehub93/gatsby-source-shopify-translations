import React, { createContext } from "react"
import { defaultLang } from "./utils/default-options"

export const LocaleContext = createContext({ defaultLang, language: "it" })
