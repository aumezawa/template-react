import express from "express"

import Auth from "./auth.js"

import React from "react"
import ReactDOMServer from "react-dom/server"
import SsrMain from "../components/ssr-main.js"

const router = express.Router()

router.get("/", Auth.isAuthenticated, (req, res, next) => {
  res.send(
    ReactDOMServer.renderToString(
      <SsrMain title={"template-react"} desc={"Template of a project with react"} author={"aume"}/>
    )
  )
})

module.exports = router
