exports.createSchemaCustomization = function ({ actions }) {
  const { createTypes } = actions

  createTypes(`
    type I18N implements Node {
      defaultLang: String
      prefixDefault: Boolean
      configPath: String
      config: [Locale]
    }
    
    type Locale {
      code: String
      hrefLang: String
      dateFormat: String
      langDir: String
      localName: String
      name: String
    }

    type Option {
      name: String
      values: [String]
    }

    type SelectedOptions {
      name: String
      value: String
    }
    
    type Variant {
      id: String
      title: String
      selectedOptions: [SelectedOptions]
    }

    type VariantNode {
      node: Variant
    }

    type VariantEdges {
      edges: [VariantNode]
    }

    type Collection {
      id: String
      title: String
    }

    type CollectionNode {
      node: Collection
    }

    type CollectionEdges {
      edges: [CollectionNode]
    }

    type ShopifyTranslatedProduct implements Node {
      id: ID
      title: String
      description: String
      descriptionHtml: String
      handle: String
      productType: String
      collections: CollectionEdges
      options: [Option]
      variants: VariantEdges
    }

    type ShopifyTranslatedCollection implements Node {
      id: ID
      title: String
      description: String
      descriptionHtml: String
      handle: String
    }
  `)
}
