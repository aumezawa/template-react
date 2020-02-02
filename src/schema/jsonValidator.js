import fs from "fs"
import jsonschema from "jsonschema"
import path from "path"

import tableSchema from "./table.json"
import commentSchema from "./comment.json"
import fileTreeSchema from "./file-tree.json"

const exports = {}

const getSchema = schemaType => {
  switch (schemaType) {
    case "table":     return tableSchema
    case "comment":   return commentSchema
    case "file-tree": return fileTreeSchema
    default:          throw new Error("undefined schema type")
  }
}

const validateJsonData = (jsonData, schemaType) => new Promise(resolve => {
  jsonschema.validate(jsonData, getSchema(schemaType), { throwError: true })
  return resolve(jsonData)
})

const validateJsonFile = (jsonPath, schemaType) => new Promise((resolve, reject) => {
  return fs.promises.readFile(jsonPath, "utf8")
  .then(data => {
    const jsonData = JSON.parse(data)
    jsonschema.validate(jsonData, getSchema(schemaType), { throwError: true })
    return resolve(jsonData)
  })
  .catch(err => {
    console.log(err)
    return reject(err)
  })
})

const validateJsonDataSync = (jsonData, schemaType) => {
  return jsonschema.validate(jsonData, getSchema(schemaType)).valid
}

const validateJsonFileSync = (jsonPath, schemaType) => {
  return jsonschema.validate(JSON.parse(fs.readFileSync(jsonPath)), getSchema(schemaType)).valid
}

exports.validateJsonData = validateJsonData
exports.validateJsonFile = validateJsonFile
exports.validateJsonDataSync = validateJsonDataSync
exports.validateJsonFileSync = validateJsonFileSync
export default exports


// main function
if (require.main === module) {
  if (process.argv.length !== 4) {
    console.log(`$ npm run jsonv -- <JSON filepath> [comment|table|file-tree]`)
    process.exit(0)
  }

  try {
    if (validateJsonFileSync(process.argv[2], process.argv[3])) {
      console.log(`${ path.basename(process.argv[2]) } is valid.`)
    } else {
      console.log(`${ path.basename(process.argv[2]) } is invalid.`)
    }
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
