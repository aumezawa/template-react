import express from "express"
import fs from "fs"
import passport from "passport"
import path from "path"

import React from "react"
import ReactDOMServer from "react-dom/server"
import SsrMain from "../src/ssr-main.js"

const authEnabled = !process.argv.includes("--noAuth")

const uriPath = "/auth"
const dirPath = path.join(__dirname, "..", "auth")
const localPath = path.join(__dirname, "..", "auth", "userlist.json")
const isAuthenticated = (req, res, next) => {
  if (authEnabled && !req.isAuthenticated()) {
    return res.redirect(uriPath + "/form/login")
  }
  return next()
}
const hadAuthenticated = (req, res, next) => {
  if (authEnabled && req.isAuthenticated()) {
    return res.redirect("/")
  }
  return next()
}
const isRoot = (req, res, next) => {
  if (req.user === "root") {
    return next()
  } else {
    return res.redirect(uriPath + "/form/login")
  }
}

const router = express.Router()

router.get("/form/login", hadAuthenticated, (req, res, next) => {
  res.send(
    ReactDOMServer.renderToString(
      <SsrMain page="login" />
    )
  )
})

router.post("/form/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.json({ success: false })
    }

    req.login(user, err => {
      if (err) {
        return next(err)
      }
      return res.json({ success: true, path: "/" })
    })
  })(req, res, next)
})

router.get("/form/logout", (req, res, next) => {
  req.logout()
  res.redirect("/")
})

router.get("/form/register", isAuthenticated, isRoot, (req, res, next) => {
  res.send(
    ReactDOMServer.renderToString(
      <SsrMain page="register" />
    )
  )
})

router.post("/form/register", isAuthenticated, isRoot, (req, res, next) => {
  fs.promises.readFile(localPath)
  .then(data => {
    let userList = JSON.parse(data)
    if (req.body.username in userList) {
      throw new Error("user has already registerd")
    }
    userList[req.body.username] = req.body.password
    return fs.promises.writeFile(localPath, JSON.stringify(userList))
  })
  .then(() => {
    return res.json({ success: true })
  })
  .catch(err => {
    return res.json({ success: false })
  })
})

module.exports = router
module.exports.uriPath = uriPath
module.exports.dirPath = dirPath
module.exports.localPath = localPath
module.exports.isRoot = isRoot
module.exports.isAuthenticated = isAuthenticated
