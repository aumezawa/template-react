import express from "express"
import fs from "fs"
import passport from "passport"
import path from "path"

import React from "react"
import ReactDOMServer from "react-dom/server"
import SsrMain from "../components/ssr-main.js"

var authEnabled = true
process.argv.forEach(arg => {
  if (arg === "--noAuth") {
    authEnabled = false
  }
})

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

router.get("/form/register", isAuthenticated, isRoot, (req, res, next) => {
  res.send(
    ReactDOMServer.renderToString(
      <SsrMain title="Register" desc="Register form" author="aume" id="register" />
    )
  )
})

router.post("/form/register", isAuthenticated, isRoot, (req, res, next) => {
  process.nextTick(() => {
    fs.readFile(localPath, (err, data) => {
      if (err) {
        return res.json({
          success: false
        })
      }
      var userList = JSON.parse(data)
      if (req.body.username in userList) {
        return res.json({
          success: false
        })
      }
      userList[req.body.username] = req.body.password
      fs.writeFile(localPath, JSON.stringify(userList), (err) => {
        if (err) {
          return res.json({
            success: false
          })
        }
        return res.json({
          success: true
        })
      })
    })
  })
})

module.exports = router
module.exports.uriPath = uriPath
module.exports.dirPath = dirPath
module.exports.localPath = localPath
module.exports.isRoot = isRoot
module.exports.isAuthenticated = isAuthenticated
