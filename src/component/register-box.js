import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import axios from "axios"
import crypto from "crypto"

export default class RegisterBox extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      execDone        : false,
      execSuccess     : true,
      isValidUsername : false,
      isValidPassword : false,
      isValidComfirm  : false
    }
  }

  static get propTypes() {
    return ({
      welcomeMsg  : PropTypes.string,
      description : PropTypes.string,
      minLength   : PropTypes.number,
      maxLength   : PropTypes.number,
      hashMode    : PropTypes.string
    })
  }

  static get defaultProps() {
    return ({
      welcomeMsg  : "Register a new user.",
      description : "(between 4 - 16 characters with [0-9a-zA-Z])",
      minLength   : 4,
      maxLength   : 16,
      hashMode    : "sha256"
    })
  }

  render() {
    return (
      <div>
        <div className={ ClassNames({ "collapse": true, "show": !this.state.execDone }) }>
          <div className={ ClassNames({ "card": true, "card-body": true, "bg-light": true }) }>
            { this.props.welcomeMsg }
          </div>
        </div>
        <div className={ ClassNames({ "collapse": true, "show": this.state.execDone && this.state.execSuccess }) }>
          <div className={ ClassNames({ "card": true, "card-body": true, "text-white": true, "bg-success": true }) }>
            Succeeded to register as "{ this.username }".
          </div>
        </div>
        <div className={ ClassNames({ "collapse": true, "show": this.state.execDone && !this.state.execSuccess }) }>
          <div className={ ClassNames({ "card": true, "card-body": true, "text-white": true, "bg-danger": true }) }>
            Failed to register as "{ this.username }"... It might be already registered.
          </div>
        </div>
        <br />
        <form ref={ elm => this.form = elm }>
          <div className="form-group">
            <label htmlFor="usernameInput">Username { this.props.description }</label>
            <input type="text" id="usernameInput" className={ ClassNames({ "form-control": true, "is-invalid": !this.state.isValidUsername }) } onChange={ e => this.validateInput(e) } />
          </div>
          <div className="form-group">
            <label htmlFor="passwordInput">Password { this.props.description }</label>
            <input type="password" id="passwordInput" className={ ClassNames({ "form-control": true, "is-invalid": !this.state.isValidPassword }) } onChange={ e => this.validateInput(e) } />
          </div>
          <div className="form-group">
            <label htmlFor="confirmInput">Password confirmation</label>
            <input type="password" id="confirmInput" className={ ClassNames({ "form-control": true, "is-invalid": !this.state.isValidComfirm }) } onChange={ e => this.validateInput(e) } />
          </div>
          <button type="button" className="btn btn-primary" disabled={ !this.state.isValidUsername || !this.state.isValidPassword || !this.state.isValidComfirm } onClick={ e => this.registerUser(e) }>Register</button>
        </form>
      </div>
    )
  }

  registerUser(event) {
    var uri = location.href
    var params = new URLSearchParams()
    params.append("username", this.username)
    params.append("password", crypto.createHash(this.props.hashMode).update(this.username + this.password, "utf8").digest("hex"))

    this.setState({
      execDone: false
    })

    axios.post(uri, params)
      .then((res) => {
        if (res.data.success) {
          this.setState({
            execDone    : true,
            execSuccess : true
          })
          this.resetForm()
        } else {
          this.setState({
            execDone    : true,
            execSuccess : false
          })
        }
      })
  }

  validateInput(event) {
    var value = event.target.value
    var isValid = true

    if (value.length < this.props.minLength)  { isValid = false }
    if (value.length > this.props.maxLength)  { isValid = false }
    if (!value.match(/^[0-9a-zA-Z]+$/))       { isValid = false }

    switch (event.target.id) {
      case "usernameInput":
        this.username = value
        this.setState({
          execDone        : false,
          isValidUsername : isValid
        })
        break

      case "passwordInput":
        this.password = value
        this.setState({
          execDone        : false,
          isValidPassword : isValid,
          isValidComfirm  : (this.password === this.comfirm)
        })
        break

      case "confirmInput":
        this.comfirm = value
        this.setState({
          execDone        : false,
          isValidComfirm  : (this.password === this.comfirm)
        })
        break

      default:
        break
    }

  }

  resetForm() {
    this.setState({
      isValidUsername : false,
      isValidPassword : false,
      isValidComfirm  : false
    })

    // Note: to display username, the variable will be cleared after setState method.
    this.username = ""
    this.password = ""
    this.comfirm = ""
    this.form.reset()
  }

}
