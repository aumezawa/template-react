import express from "express"
import multer from "multer"
import path from "path"

const uripath = "/data"
const dirpath = path.join("..", "data")

const router = express.Router()
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, dirpath)
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  })
})

router.post("/", upload.single("file"), (req, res, next) => {
  res.json({ "result": "success" })
})

module.exports = router
module.exports.uripath = uripath
module.exports.dirpath = dirpath
