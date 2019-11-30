import express from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import logger from "morgan"
import path from "path"

import indexRouter from "./routes/index"
import storageRouter from "./routes/storage"

const app = express()

/*
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "jsx")
app.engine("jsx", require("express-react-views").createEngine())
*/

app.use(logger("dev"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/", indexRouter)
app.use("/", express.static(path.join(__dirname, "public")))
app.use(storageRouter.uriPath, storageRouter)
app.use(storageRouter.uriPath, express.static(storageRouter.dirPath))

/*
app.use(function(req, res, next) {
  next(createError(404))
})
*/

/*
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})
*/

module.exports = app
