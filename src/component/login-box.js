import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import axios from "axios"
import crypto from "crypto"

export default class LoginBox extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      execDone        : false,
      execSuccess     : true,
      redirectSec     : (this.props.redirectSec > 0) ? this.props.redirectSec : 1,
      isValidUsername : false,
      isValidPassword : false,
    }
  }

  static get propTypes() {
    return ({
      welcomeMsg  : PropTypes.string,
      redirectSec : PropTypes.number,
      description : PropTypes.string,
      minLength   : PropTypes.number,
      maxLength   : PropTypes.number,
      hashMode    : PropTypes.string
    })
  }

  static get defaultProps() {
    return ({
      welcomeMsg  : "Welcome!",
      redirectSec : 3,
      description : "(between 4 - 16 characters with [0-9a-zA-Z])",
      minLength   : 4,
      maxLength   : 16,
      hashMode    : "sha256"
    })
  }

  componentDidMount() {
    this.timer = undefined
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
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
            Succeeded to login as "{ this.username }". Will redirect automatically in { this.state.redirectSec } sec.
          </div>
        </div>
        <div className={ ClassNames({ "collapse": true, "show": this.state.execDone && !this.state.execSuccess }) }>
          <div className={ ClassNames({ "card": true, "card-body": true, "text-white": true, "bg-danger": true }) }>
            Failed to login as "{ this.username }"...
          </div>
        </div>
        <br />
        <form>
          <div className="form-group">
            <label htmlFor="usernameInput">Username { this.props.description }</label>
            <input type="text" id="usernameInput" className={ ClassNames({ "form-control": true, "is-invalid": !this.state.isValidUsername }) } disabled={ this.state.execDone && this.state.execSuccess } onChange={ e => this.validateInput(e) }></input>
          </div>
          <div className="form-group">
            <label htmlFor="passwordInput">Password { this.props.description }</label>
            <input type="password" id="passwordInput" className={ ClassNames({ "form-control": true, "is-invalid": !this.state.isValidPassword }) } disabled={ this.state.execDone && this.state.execSuccess } onChange={ e => this.validateInput(e) }></input>
          </div>
          <button type="button" className="btn btn-primary" disabled={ !this.state.isValidUsername || !this.state.isValidPassword || (this.state.execDone && this.state.execSuccess) } onClick={ e => this.submitLogin(e) }>Login</button>
        </form>
      </div>
    )
  }

  submitLogin(event) {
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
          this.redirectPage(res.data.path)
        } else {
          this.setState({
            execDone    : true,
            execSuccess : false
          })
        }
      })
  }

  redirectPage(path, second) {
    if (!second) {
      this.timer = setTimeout(() => this.redirectPage(path, true), 1000)
      return
    }

    this.setState({
      redirectSec: this.state.redirectSec - 1
    })

    if (this.state.redirectSec < 1) {
      location.pathname = path
      return
    }

    this.timer = setTimeout(() => this.redirectPage(path, true), 1000)
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
          isValidPassword : isValid
        })
        break

      default:
        break
    }
  }

}
