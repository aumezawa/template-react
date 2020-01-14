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

router.get("*", Auth.isAuthenticated, (req, res, next) => {
  if (!req.query.cmd) {
    return next()
  }

  const reqPath = path.join(dirPath, req.path)
  switch (req.query.cmd) {
    case "stat":
      fs.promises.stat(reqPath)
      .then(stats => {
        return res.json({
          success : true,
          name    : path.basename(reqPath),
          file    : stats.isFile(),
          update  : stats.mtime
        })
      })
      .catch(err => {
        return res.json({ success : false })
      })
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
        return res.json({ success: false })
      }
      break

    case "mkdir":
      fs.promises.mkdir(reqPath, { recursive: true })
      .then(() => {
        return res.json({ success : true })
      })
      .catch(err => {
        return res.json({ success : false })
      })
      break

    case "rm":
      try {
        const rm = node => {
          if (fs.statSync(node).isDirectory()) {
            fs.readdirSync(node).forEach(name => {
              rm(path.join(node, name))
            })
            fs.rmdirSync(node)
          } else {
            fs.unlinkSync(node)
          }
        }

        rm(reqPath)
        return res.json({ success : true })
      } catch {
        return res.json({ success : false })
      }
      break

    case "jat":
      fs.promises.readFile(reqPath, "utf8")
      .then(data => {
        if (path.extname(reqPath) === ".json") {
          return res.json({
            success : true,
            table   : JSON.parse(data)
          })
        } else {
          return res.json({
            success : true,
            table   : {
              "format": {
                "labels"    : [{ "name": "Content", "type": "text" }],
                "hasHeader" : true,
                "hasIndex"  : true
              },
              "data": data.split(/\r\n|\n|\r/).map(line => { return { Content: line } })
            }
          })
        }
      })
      .catch(err => {
        return res.json({ success : false })
      })
      break

    default:
      return res.json({ success : false })
  }
})

router.post("*", Auth.isAuthenticated, upload.single("file"), (req, res, next) => {
  return res.json({ success: true })
})

module.exports = router
module.exports.uriPath = uriPath
module.exports.dirPath = dirPath
