import fs from "fs"
import jsonschema from "jsonschema"
import path from "path"

const tablePath   = path.join(__dirname, "./table.json")
const commentPath = path.join(__dirname, "./comment.json")
const fileTreePath = path.join(__dirname, "./file-tree.json")

const getSchemaPath = (schemaType) => {
  switch (schemaType) {
    case "table":     return tablePath
    case "comment":   return tablePath
    case "file-tree": return fileTreePath
    default:          return undefined
  }
}


const validateJson = (jsonPath, schemaPath) => new Promise((resolve, reject) => {
  let json, schema
  return fs.promises.readFile(schemaPath, "utf8")
  .then(data => {
    schema = JSON.parse(data)
    return fs.promises.readFile(jsonPath, "utf8")
  })
  .then(data => {
    json = JSON.parse(data)
    jsonschema.validate(json, schema, { throwError: true })
    return resolve(json)
  })
  .catch(err => reject(err))
})

const validateJsonType = (jsonPath, schemaType) => new Promise((resolve, reject) => {
  return validateJson(jsonPath, getSchemaPath(schemaType))
  .then(data => resolve(data))
  .catch(err => reject(err))
})


const validateJsonSync = (jsonPath, schemaPath) => {
  const json    = JSON.parse(fs.readFileSync(jsonPath))
  const schema  = JSON.parse(fs.readFileSync(schemaPath))
  return jsonschema.validate(json, schema).valid
}

const validateJsonTypeSync = (jsonPath, schemaType) => {
  const json    = JSON.parse(fs.readFileSync(jsonPath))
  const schema  = JSON.parse(fs.readFileSync(getSchemaPath(schemaType)))
  return jsonschema.validate(json, schema).valid
}


if (require.main === module) {
  if (process.argv.length !== 4) {
    console.log(`$ npm run jsonschema -- <JSON filepath> <schema filepath>`)
    process.exit(0)
  }

  try {
    if (validateJsonSync(process.argv[2], process.argv[3])) {
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

export default validateJsonType
