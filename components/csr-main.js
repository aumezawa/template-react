import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"

import "bootstrap"
import "./css/bootstrap-custom.scss"
//import "bootstrap/dist/css/bootstrap.min.css"

import FileUploaderModal from "./file-uploader-modal.js"
import LoginBox from "./login-box.js"
import RegisterBox from "./register-box.js"

export default class CsrMain extends React.Component {

  constructor(props) {
    super(props)
  }

  static get propTypes() {
    return ({
      user: PropTypes.string
    })
  }

  static get defaultProps() {
    return ({
      user: "anonymous"
    })
  }

  render() {
    return (
      <div className="text-center">
        <p>This is the main component!  Hello { this.props.user} !!!</p>
        <FileUploaderModal path="/data" />
        <br />
        <form method="get" action="/auth/form/register">
          <button type="submit" className="btn btn-primary" disabled={ user !== "root" }>Register</button>
        </form>
        <form method="get" action="/auth/form/logout">
          <button type="submit" className="btn btn-secondary">Logout</button>
        </form>
      </div>
    )
  }

}

// render on loaded
var main = document.getElementById("csr-main")
if (main) {
  var user = main.getAttribute("user")
  ReactDOM.render(<CsrMain user={ user } />, main)
}

var login = document.getElementById("login")
if (login) {
  var user = login.getAttribute("user")
  ReactDOM.render(<LoginBox />, login)
}

var register = document.getElementById("register")
if (register) {
  var user = register.getAttribute("user")
  ReactDOM.render(<RegisterBox />, register)
}
