const {
  createSchemaCustomization,
} = require("./dist/plugin/createSchemaCustomization")
const { sourceNodes } = require("./dist/plugin/sourceNodes")
const { onCreatePage } = require("./dist/plugin/onCreatePage")
const { onCreateNode } = require("./dist/plugin/onCreateNode")

exports.createSchemaCustomization = createSchemaCustomization
exports.sourceNodes = sourceNodes
exports.onCreatePage = onCreatePage
exports.onCreateNode = onCreateNode
