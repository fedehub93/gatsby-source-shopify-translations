<h1 align="center">
  gatsby-source-shopify-translations
</h1>

Source translations resources from shopify and easily translate your Gatsby website into multiple languages.

## Features

---

- Retrieving translated resources from Shopify. `Products` | `Collections`
- Support multi-language url routes in a single page component. You don't have to create separate pages such as `pages/en/index.js` or `pages/es/index.js`.
- SEO friendly

## How to use

### Install package

`yarn add gatsby-source-shopify-translations`

or

`npm install gatsby-source-shopify-translations`

### Configure the plugin

```javascript
// gatsby-config.js
plugins: [
  {
    resolve: `gatsby-source-shopify-translations`,
    options: {
      shopName: process.env.GATSBY_SHOPIFY_STORE_URL,
      shopifyPassword: process.env.SHOPIFY_SHOP_PASSWORD,
      accessToken: process.env.GATSBY_SHOPIFY_ACCESS_TOKEN,
      defaultLang: "it",
      prefixDefault: true,
      configPath: require.resolve("./locales/config.json"),
      locales: ["it", "en"],
    },
  },
]
```

### Translated resources in GraphQL Data Layer

You will find new nodes called `AllShopifyTranslatedProduct` and `AllShopifyTranslatedCollection`.

Here we have all the translated resources with the storefrontId and you can manually create pages with translated url.

If you want to manually translated page you have to set the property `isAlreadyTranslated` to `true` and the `locale` to the current locale within de page context. (see below)

In this way the plugin does not translated again this page.

```
// gatsby-node.js
const result = await graphql(`
    {
      collections: allShopifyCollection {
        edges {
          node {
            id
            title
            description
            descriptionHtml
            storefrontId
            handle
          }
        }
      }
      translatedCollections: allShopifyTranslatedCollection {
        edges {
          node {
            title
            description
            descriptionHtml
            locale
            storefrontId
            handle
          }
        }
      }
    }

  const collections = result.data.collections.edges
  const translatedCollections = result.data.translatedCollections.edges

  collections.forEach(category => {
    const translatedCollection = translatedCollections.filter(
      tCollection =>
        tCollection.node.storefrontId === category.node.storefrontId
    )

    translatedCollection.forEach(tCollection => {
      const newCollection = {
        ...category,
        node: {
          ...category.node,
          title: tCollection.node.title,
          description: tCollection.node.description,
          descriptionHtml: tCollection.node.descriptionHtml,
          handle: slugify(tCollection.node.title),
        },
      }

      createPage({
        path: `/${tCollection.node.locale}/${slugify(tCollection.node.title)}`,
        component: productCollectionsTemplate,
        context: {
          id: newCollection.node.id,
          locale: tCollection.node.locale,
          title: newCollection.node.title,
          storefrontId: newCollection.node.storefrontId,
          originalPath: category.node.handle,
          isAlreadyTranslated: true,
        },
      })
    })
  })
```

### Setup translations

You'll also need to create a `config.json` file in `locales` folder on base root and `[locale]` subfolder with `translations.json`.

If you want to translate the url of pages in `pages` folder than you have to set the `locales/config.json` file like the example below:

```json
// locales/config.json
[
  {
    "code": "it",
    "pages": [
      {
        "originalPath": "/contacts/",
        "path": "/contatti/"
      }
    ]
  },
  {
    "code": "en",
    "pages": [
      {
        "originalPath": "/contacts/",
        "path": "/contacts/"
      }
    ]
  }
]
```

```json
// translation.json /it/
{
  "title": "mio titolo"
}

// translation.json /en/
{
  "title": "my title"
}
```

### Change your components

Use react i18next [`useTranslation`](https://react.i18next.com/latest/usetranslation-hook) react hook and [`Trans`](https://react.i18next.com/latest/trans-component) component to translate your pages.

Replace [Gatsby `Link`](https://www.gatsbyjs.org/docs/gatsby-link) component with the `Link` component exported from `gatsby-source-shopify-translations`

```javascript
import React from "react"
import { Link, Trans, useTranslation } from "gatsby-source-shopify-translations"
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

## Credits

This package is based on:

- [gatsby-plugin-react-i18next](https://github.com/microapps/gatsby-plugin-react-i18next) by Microapps

## License

MIT &copy; [fedehub93](https://github.com/fedehub93)
