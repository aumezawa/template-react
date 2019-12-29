import React from "react"
import PropTypes from "prop-types"

import axios from "axios"
import crypto from "crypto"

import MessageCard from "./message-card.js"
import RegisterForm from "./register-form.js"

export default class RegisterBox extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      done    : false,
      success : false,
    }
    this.message = this.props.description
  }

  static get propTypes() {
    return ({
      description : PropTypes.string
    })
  }

  static get defaultProps() {
    return ({
      description : "Register a new user."
    })
  }

  render() {
    return (
      <div>
        <MessageCard
          message={ this.message }
          type={ this.state.done ? (this.state.success ? "success" : "failure") : "normal" }
        />
        <RegisterForm
          ref={ ref => this.form = ref }
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
        this.message = `Succeeded to register as "${ data.username }".`
        this.setState({
          done    : true,
          success : true
        })
        this.form.reset()
      } else {
        this.message = `Failed to register as "${ data.username }"... It might be already registered.`
        this.setState({
          done    : true,
          success : false
        })
      }
    })
  }

}
