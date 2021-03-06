import express from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import fs from "fs"
import helmet from "helmet"
import logger from "morgan"
import passport from "passport"
import passportLocal from "passport-local"
import path from "path"
import session from "express-session"

import indexRouter from "./routes/index.js"
import storageRouter from "./routes/storage.js"
import authRouter from "./routes/auth.js"

import project from "./package.json"

const app = express()

app.set("http_port", process.env.HTTP_PORT || project.http_port || 80)
app.set("https_port", process.env.HTTPS_PORT || project.https_port || 443)
app.set("http_enable", project.http_enable)

app.use(logger("dev"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(helmet())

app.use(session({ secret: project.name }))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new passportLocal.Strategy({
    userNameField: "username",
    passwordField: "password"
  }, (username, password, done) => {
    fs.promises.readFile(authRouter.localPath)
    .then(data => {
      if (password !== JSON.parse(data)[username]) {
        throw new Error("no user found")
      }
      return done(null, username)
    })
    .catch(err => {
      return done(null, false)
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
app.use((req, res, next) => {
  next(createError(404))
})
*/

/*
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})
*/

module.exports = app
