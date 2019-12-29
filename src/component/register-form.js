import React from "react"
import PropTypes from "prop-types"

import TextForm from "./text-form.js"

export default class RegisterFrom extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      valid: false
    }
    this.data = {}
    this.children = {}
  }

  static get propTypes() {
    return ({
      className : PropTypes.string,
      disabled  : PropTypes.bool,
      onChange  : PropTypes.func,
      onSubmit  : PropTypes.func,
      minUserLen: PropTypes.number,
      maxUserLen: PropTypes.number,
      minPassLen: PropTypes.number,
      maxPassLen: PropTypes.number
    })
  }

  static get defaultProps() {
    return ({
      className : "",
      disabled  : false,
      onChange  : undefined,
      onSubmit  : undefined,
      minUserLen: 4,
      maxUserLen: 16,
      minPassLen: 4,
      maxPassLen: 16
    })
  }

  componentDidMount() {
    this.init()
  }

  render() {
    return (
      <div className={ this.props.className }>
        <TextForm
          ref={ ref => this.children.username = ref }
          label="username"
          disabled={ this.props.disabled }
          onChange={ (valid, data) => this.handleChangeUsername(valid, data) }
          validate={ text => this.validateUsername(text) }
        />
        <TextForm
          ref={ ref => this.children.password = ref }
          label="password"
          type="password"
          disabled={ this.props.disabled }
          onChange={ (valid, data) => this.handleChangePassword(valid, data) }
          validate={ text => this.validatePassword(text) }
        />
        <TextForm
          ref={ ref => this.children.confirm = ref }
          label="confirm"
          type="password"
          disabled={ this.props.disabled }
          onChange={ (valid, data) => this.handleChangeConfirm(valid, data) }
          validate={ text => this.validatePassword(text) }
        />
        <button
          type="button"
          className="btn btn-primary"
          disabled={ !this.state.valid || this.props.disabled }
          onClick={ e => this.handleSubmit(e) }
        >
          Register
        </button>
      </div>
    )
  }

  init(newValid = this.isValid()) {
    this.data = {
      username: this.children.username.data.text,
      password: this.children.password.data.text,
      confirm : this.children.confirm.data.text
    }
    this.setState({
      valid: newValid
    })
  }

  isValid(valid = true, exceptKeys = []) {
    return Object.keys(this.children).reduce((acc, key) => {
      if (exceptKeys.includes(key)) {
        return acc
      } else {
        return acc && this.children[key].state.valid
      }
    }, valid)
  }

  handleChangeUsername(valid, data) {
    this.data.username = data.text

    let newValid = this.isValid(valid, ["username"])
    this.setState({
      valid: newValid,
    })

    if (this.props.onChange) {
      this.props.onChange(newValid, this.data)
    }
  }

  validateUsername(text) {
    if (text.length < this.props.minUserLen) {
      return false
    }
    if (text.length > this.props.maxUserLen) {
      return false
    }
    if (!text.match(/^[0-9a-zA-Z]+$/)) {
      return false
    }
    return true
  }

  handleChangePassword(valid, data) {
    this.data.password = data.text

    let newValid = this.isValid(valid && (this.data.password === this.data.confirm), ["password"])
    this.setState({
      valid: newValid,
    })

    if (this.props.onChange) {
      this.props.onChange(newValid, this.data)
    }
  }

  validatePassword(text) {
    if (text.length < this.props.minPassLen) {
      return false
    }
    if (text.length > this.props.maxPassLen) {
      return false
    }
    if (!text.match(/^[0-9a-zA-Z]+$/)) {
      return false
    }
    return true
  }

  handleChangeConfirm(valid, data) {
    this.data.confirm = data.text

    let newValid = this.isValid(valid && (this.data.password === this.data.confirm), ["confirm"])
    this.setState({
      valid: newValid,
    })

    if (this.props.onChange) {
      this.props.onChange(newValid, this.data)
    }
  }

  handleSubmit(event) {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.data)
    }
  }

  reset() {
    this.init(Object.keys(this.children).reduce((acc, key) => {
      return this.children[key].reset() && acc
    }, true))
  }

}
