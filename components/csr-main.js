import React from "react"
import ReactDOM from "react-dom"

import "bootstrap"
import "./css/bootstrap-custom.scss"
//import "bootstrap/dist/css/bootstrap.min.css"

import FileUploaderModal from "./file-uploader-modal.js"
import LoginBox from "./login-box.js"

export default class CsrMain extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="text-center">
        <p>This is the main component!</p>
        <FileUploaderModal path="/data" />
      </div>
    )
  }

}

// render on loaded
var main = document.getElementById("csr-main")
if (main) {
  ReactDOM.render(<CsrMain />, main)
}

var login = document.getElementById("login")
if (login) {
  ReactDOM.render(<LoginBox />, login)
}
