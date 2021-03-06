import React from "react"
import ReactDOM from "react-dom"

import "bootstrap"
import "./css/bootstrap-custom.scss"

import MainPage from "./page/main-page.js"
import LoginPage from "./page/login-page.js"
import RegisterPage from "./page/register-page.js"
import SandboxPage from "./page/sandbox-page.js"


// render on loaded
const main = document.getElementById("csr-main")
const project = main.getAttribute("project")
const author = main.getAttribute("author")
const version = main.getAttribute("version")
const user = main.getAttribute("user")
switch (main.getAttribute("page")) {
  case "main":
    ReactDOM.render(<MainPage project={ project } author={ author } version={ version } user={ user } />, main)
    break

  case "login":
    ReactDOM.render(<LoginPage project={ project } author={ author } version={ version } user={ user } />, main)
    break

  case "register":
    ReactDOM.render(<RegisterPage project={ project } author={ author } version={ version } user={ user } />, main)
    break

  case "sandbox":
    ReactDOM.render(<SandboxPage project={ project } author={ author } version={ version } user={ user } />, main)
    break

  default:
    break
}
