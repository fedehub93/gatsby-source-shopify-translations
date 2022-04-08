exports.createSchemaCustomization = function ({ actions }) {
  const { createTypes } = actions

  createTypes(`
    type Locale implements Node {
      language: String
      ns: String
      data: String
      fileAbsolutePath: String
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

    type Metafield {
      id: String
      key: String
      value: String
      description: String
    }

    type MetafieldNode {
      node: Metafield
    }

    type MetafieldEdges {
      edges: [MetafieldNode]
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

    type Image {
      id: String
      src: String
      width: String
      height: String
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
      metafields: MetafieldEdges
    }

    type ShopifyTranslatedCollection implements Node {
      id: ID
      title: String
      description: String
      descriptionHtml: String
      handle: String
      image: Image
    }
  `)
}
