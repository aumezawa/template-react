import express from "express"
import fs from "fs"
import multer from "multer"
import path from "path"

import Auth from "./auth.js"
import StorageHook from "../src/hook/storage-hook.js"
import jsonValidator from "../src/schema/jsonValidator.js"

import project from "../package.json"

const uriPath = "/data"
const dirPath = path.isAbsolute(project.storage) ? project.storage : path.join(__dirname, "..", project.storage)

const router = express.Router()
const upload = (req, res, next) => {
  return multer({
    storage: multer.diskStorage({
      destination : (req, file, cb) => cb(null, path.join(dirPath + req.path)),
      filename    : (req, file, cb) => cb(null, file.originalname)
    })
  }).single("file")(req, res, err => (err ? next(err) : next()))
}

router.get("*", Auth.isAuthenticated, (req, res, next) => {
  if (req.query.cmd) {
    const reqPath = path.join(dirPath, req.path)
    StorageHook(req.query.cmd, reqPath)
    switch (req.query.cmd) {
      case "stat":
        return fs.promises.stat(reqPath)
        .then(stats => res.json({
          success : true,
          name    : path.basename(reqPath),
          file    : stats.isFile(),
          update  : stats.mtime
        }))
        .catch(err => res.json({ success : false }))
        break

      case "ls":
        try {
          const ls = node => {
            if (fs.statSync(node).isDirectory()) {
              return ({
                name: path.basename(node),
                file: false,
                children: fs.readdirSync(node).map(name => ls(path.join(node, name))).filter(x => x)
              })
            } else if (!node.includes(".cmt") && !node.includes(".vft")) {
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

      case "vft":
        return jsonValidator.validateJsonFile(reqPath + ".vft", "file-tree")
        .then(data => res.json({
          success : true,
          ls      : data
        }))
        .catch(err => res.json({ success: false }))
        break

      case "mkdir":
        return fs.promises.mkdir(reqPath, { recursive: true })
        .then(() => res.json({ success : true }))
        .catch(err => res.json({ success : false }))

      case "rm":
        try {
          const rm = node => {
            if (fs.statSync(node).isDirectory()) {
              fs.readdirSync(node).forEach(name => rm(path.join(node, name)))
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

      case "json":
        const makeTable = filepath => new Promise((resolve, reject) => {
          return fs.promises.readFile(filepath, "utf8")
          .then(data => resolve({
            "format": {
              "labels"    : [{ "name": "Content", "type": "text" }],
              "hasHeader" : true,
              "hasIndex"  : true,
              "contentKey": "Content"
            },
            "data": data.split(/\r\n|\n|\r/).map(line => ({ Content: line }))
          }))
          .catch(err => reject(err))
        })

        if (path.extname(reqPath) === ".json") {
          return jsonValidator.validateJsonFile(reqPath, "table")
          .then(data => res.json({
            success : true,
            table   : data
          }))
          .catch(err => {
            console.log(err)
            return makeTable(reqPath)
            .then(data => res.json({
              success : true,
              table   : data
            }))
            .catch(err => res.json({ success: false }))
          })
        } else {
          return makeTable(reqPath)
          .then(data => res.json({
            success : true,
            table   : data
          }))
          .catch(err => res.json({ success: false }))
        }
        break

      case "comment":
        return fs.promises.stat(reqPath)
        .then(() => {
          return fs.promises.readFile(reqPath + ".cmt", "utf8")
          .then(data => res.json({
            success : true,
            comments: JSON.parse(data)
          }))
          .catch(err => res.json({
            success : true,
            comments: {}
          }))
        })
        .catch(err => res.json({ success: false }))
        break

      case "zip":
        return res.json({ success : true })
        break

      case "unzip":
        return res.json({ success : true })
        break

      default:
        return res.json({ success : false })
    }
  }

  return next()
})

router.post("*", Auth.isAuthenticated, upload, (req, res, next) => {
  if (req.file) {
    return res.json({ success : true })
  }

  if (req.body.cmd) {
    const reqPath = path.join(dirPath, req.path)
    switch (req.body.cmd) {
      case "comment":
        let line = req.body.line
        let comment = JSON.parse(req.body.comment)
        let comments = {}
        return fs.promises.readFile(reqPath + ".cmt", "utf8")
        .then(data => {
          comments = JSON.parse(data)
        })
        .catch(err => {
          comments = {}
        })
        .then(() => {
          if (!(line in comments)) {
            comments[line] = []
          }
          comments[line].push(comment)
          return fs.promises.writeFile(reqPath + ".cmt", JSON.stringify(comments))
        })
        .then(() => res.json({ success: true }))
        .catch(err => res.json({ success: false }))
        break

      default:
        return res.json({ success: false })
    }
  }

  return next()
})

module.exports = router
module.exports.uriPath = uriPath
module.exports.dirPath = dirPath
