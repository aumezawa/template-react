import express from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import fs from "fs"
import logger from "morgan"
import passport from "passport"
import passportLocal from "passport-local"
import path from "path"
import session from "express-session"

import indexRouter from "./routes/index.js"
import storageRouter from "./routes/storage.js"
import authRouter from "./routes/auth.js"

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

app.use(session({ secret: "react-aume" }))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new passportLocal.Strategy({
    userNameField: "username",
    passwordField: "password"
  }, (username, password, done) => {
    process.nextTick(() => {
      fs.readFile(authRouter.localPath, (err, data) => {
        if (err) {
          return done(null, false)
        }
        if (password !== JSON.parse(data)[username]) {
          return done(null, false)
        }
        return done(null, username)
      })
    })
  })
)

passport.serializeUser((user, done) => { done(null, user) })
passport.deserializeUser((user, done) => { done(null, user) })

app.use("/", indexRouter)
app.use("/", express.static(path.join(__dirname, "public")))
app.use(storageRouter.uriPath, storageRouter)
app.use(storageRouter.uriPath, express.static(storageRouter.dirPath))
app.use(authRouter.uriPath, authRouter)

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
