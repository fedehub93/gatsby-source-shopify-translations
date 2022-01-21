<h1 align="center">
  gatsby-source-shopify-translations
</h1>

Source translations resources from shopify and easily translate your Gatsby website into multiple languages.

## Features

---

- Retrieving API Translations resources from Shopify. `Products` | `Collections`
- Support multi-language url routes in a single page component. You don't have to create separate pages such as `pages/en/index.js` or `pages/es/index.js`.
- SEO friendly

## How to use

### Configure the plugin

```javascript
// gatsby-config.js
plugins: [
  {
    resolve: require.resolve(`./plugins/source-plugin`),
    options: {
      shopName: process.env.GATSBY_SHOPIFY_STORE_URL,
      shopifyPassword: process.env.SHOPIFY_SHOP_PASSWORD,
      accessToken: process.env.GATSBY_SHOPIFY_ACCESS_TOKEN,
      defaultLang: "it",
      prefixDefault: true,
      configPath: require.resolve("./i18n/config.json"),
      locales: ["it", "en"],
    },
  },
]
```

### You'll also need to create a `config.json` file in `i18n` folder on base root and `[locale]` subfolder with `translations.json`.

```json
// i18n.json
[
  {
    "code": "it",
    "hrefLang": "it-IT",
    "name": "Italian",
    "localName": "Italiano",
    "langDir": "ltr",
    "dateFormat": "DD.MM.YYYY"
  },
  {
    "code": "en",
    "hrefLang": "en-US",
    "name": "English",
    "localName": "English",
    "langDir": "ltr",
    "dateFormat": "MM/DD/YYYY"
  }
]
```

```json
// translation.json /en/
{
  "title": "my title"
}
```

### Change your components

Use react i18next [`useTranslation`](https://react.i18next.com/latest/usetranslation-hook) react hook and [`Trans`](https://react.i18next.com/latest/trans-component) component to translate your pages.

Replace [Gatsby `Link`](https://www.gatsbyjs.org/docs/gatsby-link) component with the `LocalizedLink` component exported from `gatsby-source-shopify-translations`

```javascript
import React from "react"
import {
  LocalizedLink as Link,
  Trans,
  useTranslation,
} from "gatsby-source-shopify-translations"
import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => {
  const { t } = useTranslation()
  return (
    <Layout>
      <SEO title={t("Home")} />
      <h1>
        <Trans>Hi people</Trans>
      </h1>
      <p>
        <Trans>Welcome to your new Gatsby site.</Trans>
      </p>
      <p>
        <Trans>Now go build something great.</Trans>
      </p>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
      <Link to="/page-2/">
        <Trans>Go to page 2</Trans>
      </Link>
    </Layout>
  )
}
```
