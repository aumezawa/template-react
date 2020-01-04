import express from "express"
import fs from "fs"
import multer from "multer"
import path from "path"

import Auth from "./auth.js"

const uriPath = "/data"
const dirPath = path.join(__dirname, "..", "..", "data")

const router = express.Router()
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(dirPath + req.path))
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  })
})

// For Table Test - Start
router.get("/summary", Auth.isAuthenticated, (req, res, next) => {
  process.nextTick(() => {
    fs.readFile(path.join(__dirname, "..", "..", "data", "summary.json"), (err, data) => {
      if (err) {
        return res.json({})
      }
      return res.json(JSON.parse(data))
    })
  })
})
// For Table Test - End

router.get("*", Auth.isAuthenticated, (req, res, next) => {
  if (!req.query.cmd) {
    return next()
  }

  const reqPath = path.join(dirPath, req.path)
  switch (req.query.cmd) {
    case "fstat":
      try {
        let fstat = fs.statSync(reqPath)
        if (!fstat.isFile()) {
          throw new FileError('no file exists')
        }
        return res.json({
          success : true,
          name    : path.basename(reqPath),
          update  : fstat.mtime
        })
      } catch {
        return res.json({
          success : false
        })
      }
      break

    case "ls":
      try {
        const ls = node => {
          if (fs.statSync(node).isDirectory()) {
            return ({
              name: path.basename(node),
              file: false,
              children: fs.readdirSync(node).map(name => {
                return ls(path.join(node, name))
              })
            })
          } else {
            return ({
              name: path.basename(node),
              file: true
            })
          }
        }

        return res.json({
          success : true,
          ls      : ls(reqPath)
        })
      } catch {
        return res.json({
          success: false
        })
      }
      break

    case "mkdir":
      try {
        fs.mkdirSync(reqPath, { recursive: true })
        return res.json({
          success: true
        })
      } catch {
        return res.json({
          success: false
        })
      }
      break

    case "rm":
      try {
        const rm = node => {
          if (fs.statSync(node).isDirectory()) {
            fs.readdirSync(node).forEach(name => {
              rm(path.join(node, name))
            })
          } else {
            fs.unlinkSync(node)
          }
        }

        rm(reqPath)
        return res.json({
          success: true
        })
      } catch {
        return res.json({
          success: false
        })
      }
      break

    case "jat":
      try {
        return res.json({
          success : true,
          table   : {
            "format": {
              "title": "",
              "keys": ["Content"],
              "hasHeader": true,
              "hasIndex": true,
              "contentKey": "Content"
            },
            "data": fs.readFileSync(reqPath, "utf8").split(/\r\n|\n|\r/).map(line => {
              return {
                Content: line
              }
            })
          }
        })
      } catch {
        return res.json({
          success : false
        })
      }
      break

    default:
      return res.json({
        success: false
      })
  }
})

router.post("*", Auth.isAuthenticated, upload.single("file"), (req, res, next) => {
  return res.json({
    success: true
  })
})

module.exports = router
module.exports.uriPath = uriPath
module.exports.dirPath = dirPath
