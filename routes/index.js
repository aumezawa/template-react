import express from "express"
import React from "react"
import { renderToString } from "react-dom/server"
import SsrMain from "../components/ssr-main.js"

const router = express.Router()

router.get("/", function(req, res, next) {
  res.send(
    renderToString(
      <SsrMain title={"template-react"} desc={"Template of a project with react"} author={"aume"}/>
    )
  )
})

module.exports = router
