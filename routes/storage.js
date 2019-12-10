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

  var reqPath = path.join(dirPath, req.path)
  switch (req.query.cmd) {
    case "fstat":
      try {
        var stats = fs.statSync(reqPath)
        if (!stats.isFile()) {
          throw new FileError('no file exists')
        }
        res.json({
          "fileName"  : path.basename(req.path),
          "lastUpdate": stats.mtime
        })
      } catch {
        res.json({
          "fileName": "none"
        })
      }
      break

    case "lsdir":
      try {
        var stats = fs.statSync(reqPath)
        if (!stats.isDirectory()) {
          throw new FileError('no directory exists')
        }
        var fileList = []
        var dirList = []
        var tmpList = [reqPath]
        while (tmpList.length > 0) {
          let node = tmpList.pop()
          if (fs.statSync(node).isFile()) {
            fileList.push(node)
          } else if (fs.statSync(node).isDirectory()) {
            if (node !== reqPath) {
              dirList.push(node)
            }
            fs.readdirSync(node).forEach(name => tmpList.push(path.join(node, name)))
          }
        }
        res.json({
          "dirName" : req.path,
          "fileList":
            fileList.map(file => {
              return file.replace(dirPath, "").replace(/\\/g, "/")
            }),
          "dirList" :
            dirList.map(dir => {
              return dir.replace(dirPath, "").replace(/\\/g, "/")
            }),
          "lsdir"   :
            fs.readdirSync(reqPath).map(name => {
              return ({
                "name": name,
                "type": fs.statSync(path.join(reqPath, name)).isFile() ? "file" : "dir"
              })
            })
        })
      } catch {
        res.json({
          "dirName": "none"
        })
      }
      break

    case "mkdir":
      try {
        fs.mkdirSync(reqPath, {recursive: true})
        res.json({
          "result": "success"
        })
      } catch {
        res.json({
          "result": "failure"
        })
      }
      break

    case "rm":
      try {
        var dirList = []
        var tmpList = [reqPath]
        while (tmpList.length > 0) {
          let node = tmpList.pop()
          if (fs.statSync(node).isFile()) {
            fs.unlinkSync(node)
          } else if (fs.statSync(node).isDirectory()) {
            dirList.unshift(node)
            fs.readdirSync(node).forEach(name => tmpList.push(path.join(node, name)))
          }
        }
        dirList.forEach(dir => fs.rmdirSync(dir))
        res.json({
          "result": "success"
        })
      } catch {
        res.json({
          "result": "failure"
        })
      }
      break

    default:
      next()
  }
})

router.post("*", Auth.isAuthenticated, upload.single("file"), (req, res, next) => {
  res.json({
    "result": "success"
  })
})

module.exports = router
module.exports.uriPath = uriPath
module.exports.dirPath = dirPath
