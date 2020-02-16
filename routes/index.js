import express from "express"

import Auth from "./auth.js"

import React from "react"
import ReactDOMServer from "react-dom/server"
import SsrMain from "../src/ssr-main.js"

const page = !process.argv.includes("--sandbox") ? "main" : "sandbox"

const router = express.Router()

router.get("/", Auth.isAuthenticated, (req, res, next) => {
  return res.send(
    ReactDOMServer.renderToString(
      <SsrMain page={ page } user={ req.user } />
    )
  )
})

module.exports = router
