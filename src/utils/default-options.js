const defaultLang = `en`

function withDefaults(themeOptions) {
  if (!themeOptions) {
    return { defaultLang, prefixDefault: true }
  }

  return {
    ...themeOptions,
    configPath: themeOptions.configPath,
    defaultLang: themeOptions.defaultLang || defaultLang,
    prefixDefault: themeOptions.prefixDefault
      ? themeOptions.prefixDefault
      : false,
    locales: themeOptions.locales || null,
    sourceOnlyMode: themeOptions.sourceOnlyMode ? themeOptions.sourceOnlyMode : false
  }
}

module.exports = {
  defaultLang,
  withDefaults,
}
