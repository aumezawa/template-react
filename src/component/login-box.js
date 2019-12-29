import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import axios from "axios"
import crypto from "crypto"

import LoginForm from "./login-form.js"
import MessageCard from "./message-card.js"

export default class LoginBox extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      done    : false,
      success : false,
    }
    this.message = this.props.description
    this.redirectSec = (this.props.redirectSec > 0) ? this.props.redirectSec : 1
  }

  static get propTypes() {
    return ({
      description : PropTypes.string,
      redirectSec : PropTypes.number
    })
  }

  static get defaultProps() {
    return ({
      description : `Please input your "username" and "password" (between 4 - 16 characters with [0-9a-zA-Z])`,
      redirectSec : 3
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
        <MessageCard
          message={ this.message }
          type={ this.state.done ? (this.state.success ? "success" : "failure") : "normal" }
        />
        <LoginForm
          disabled={ this.state.success }
          onSubmit={ data => this.handleSubmit(data) }
        />
      </div>
    )
  }

  handleSubmit(data) {
    var uri = location.href
    var params = new URLSearchParams()
    params.append("username", data.username)
    params.append("password", crypto.createHash("sha256").update(data.username + data.password, "utf8").digest("hex"))

    this.setState({
      done    : false
    })

    axios.post(uri, params)
    .then((res) => {
      if (res.data.success) {
        this.message = `Succeeded to login as "${ data.username }". Will redirect automatically in ${ this.redirectSec } sec.`
        this.setState({
          done    : true,
          success : true
        })
        setTimeout(() => location.pathname = res.data.path, this.redirectSec * 1000)
      } else {
        this.message = `Failed to login as "${ data.username }"...`
        this.setState({
          done    : true,
          success : false
        })
      }
    })
  }

}
