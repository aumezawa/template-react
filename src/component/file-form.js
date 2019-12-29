import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import path from "path"

import uniqueId from "../lib/uniqueId.js"

export default class FileForm extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      valid: false
    }
    this.id = {
      label: uniqueId()
    }
    this.data = {
      file    : undefined,
      filename: ""
    }
    this.input = {}
  }

  static get propTypes() {
    return ({
      label     : PropTypes.string,
      className : PropTypes.string,
      submit    : PropTypes.bool,
      disabled  : PropTypes.bool,
      onChange  : PropTypes.func,
      onSubmit  : PropTypes.func,
      validate  : PropTypes.func
    })
  }

  static get defaultProps() {
    return ({
      label     : "File:",
      className : "",
      submit    : false,
      disabled  : false,
      onChange  : undefined,
      onSubmit  : undefined,
      validate  : undefined
    })
  }

  render() {
    return (
      <div className={ this.props.className }>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">{ this.props.label }</span>
          </div>
          <div className="custom-file">
            <input
              ref={ ref => this.input.file = ref }
              className={ ClassNames({ "custom-file-input": true, "is-invalid": !this.state.valid }) }
              type="file"
              id={ this.id.label }
              disabled={ this.props.disabled }
              onChange={ e => this.handleChangeFile(e) }
            />
            <label className="custom-file-label" htmlFor={ this.id.label }>{ this.data.filename }</label>
          </div>
          <div className={ ClassNames({ "input-group-append": true, "d-none": !this.props.submit }) }>
            <button
              type="button"
              className="btn btn-primary"
              disabled={ !this.state.valid || this.props.disabled }
              onClick={ e => this.handleSubmit(e) }
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  }

  isValid() {
    if (this.data.filename === "") {
      return false
    }
    if (this.props.validate && !this.props.validate(this.data.filename)) {
      return false
    }
    return true
  }

  handleChangeFile(event) {
    this.data.file = event.target.files[0]
    this.data.filename = path.basename(event.target.value.replace(/\\/g, "/"))

    let newValid = this.isValid()
    this.setState({
      valid: newValid
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
    this.input.file.value = ""

    this.data = {
      file    : undefined,
      filename: ""
    }

    let newValid = false
    this.setState({
      valid: newValid
    })

    return newValid
  }

}
