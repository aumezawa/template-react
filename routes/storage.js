import express from "express"
import fs from "fs"
import multer from "multer"
import path from "path"

import Auth from "./auth.js"

const uriPath = "/data"
const dirPath = path.join(__dirname, "..", "..", "data")

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
  if (!req.query.cmd) {
    return next()
  }

  const reqPath = path.join(dirPath, req.path)
  switch (req.query.cmd) {
    case "stat":
      fs.promises.stat(reqPath)
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
          } else if (!(node.includes(".cmt"))) {
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
      .then(() => res.json({ success : true }))
      .catch(err => res.json({ success : false }))
      break

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
      // TODO: should use json schema
      if (path.extname(reqPath) === ".json") {
        fs.promises.readFile(reqPath, "utf8")
        .then(data => res.json({
          success : true,
          table   : JSON.parse(data)
        }))
        .catch(err => res.json({ success : false }))
      } else {
        fs.promises.readFile(reqPath, "utf8")
        .then(data => res.json({
          success : true,
          table   : {
            "format": {
              "labels"    : [{ "name": "Content", "type": "text" }],
              "hasHeader" : true,
              "hasIndex"  : true,
              "contentKey": "Content"
            },
            "data": data.split(/\r\n|\n|\r/).map(line => ({ Content: line }))
          }
        }))
        .catch(err => res.json({ success : false }))
      }
      break

    case "comment":
      fs.promises.stat(reqPath)
      .then(() => {
        fs.promises.readFile(reqPath + ".cmt", "utf8")
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

    default:
      return res.json({ success : false })
  }
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
