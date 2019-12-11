import express from "express"
import passport from "passport"
import path from "path"

import React from "react"
import ReactDOMServer from "react-dom/server"
import SsrMain from "../components/ssr-main.js"

const uriPath = "/auth"
const dirPath = path.join(__dirname, "..", "auth")
const localPath = path.join(__dirname, "..", "auth", "userlist.json")

const router = express.Router()

router.get("/form/login", (req, res, next) => {
  res.send(
    ReactDOMServer.renderToString(
      <SsrMain title="Login" desc="Login form" author="aume" id="login" />
    )
  )
})

router.post("/form/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.json({
        success: false
      })
    }

    req.login(user, err => {
      if (err) {
        return next(err)
      }
      return res.json({
        success: true,
        path: "/"
      })
    })
  })(req, res, next)
})

router.get("/form/logout", (req, res, next) => {
  req.logout()
  res.redirect("/")
})

module.exports = router
module.exports.uriPath = uriPath
module.exports.dirPath = dirPath
module.exports.localPath = localPath
module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  } else {
    return res.redirect(uriPath + "/form/login")
  }
}
