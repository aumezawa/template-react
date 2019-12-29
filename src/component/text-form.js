import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

export default class TextForm extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      valid: false
    }
    this.data = {
      text: ""
    }
    this.input = {}
  }

  static get propTypes() {
    return ({
      label     : PropTypes.string,
      type      : PropTypes.string,
      className : PropTypes.string,
      disabled  : PropTypes.bool,
      onChange  : PropTypes.func,
      validate  : PropTypes.func
    })
  }

  static get defaultProps() {
    return ({
      label     : "Text:",
      type      : "text",
      className : "",
      disabled  : false,
      onChange  : undefined,
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
          <input
            ref={ ref => this.input.text = ref }
            className={ ClassNames({ "form-control": true, "text-monospace": true, "is-invalid": !this.state.valid }) }
            type={ this.props.type }
            disabled={ this.props.disabled }
            onChange={ e => this.handleChangeText(e) }
          />
        </div>
      </div>
    )
  }

  isValid() {
    if (this.data.text === "") {
      return false
    }
    if (this.props.validate && !this.props.validate(this.data.text)) {
      return false
    }
    return true
  }

  handleChangeText(event) {
    this.data.text = event.target.value

    let newValid = this.isValid()
    this.setState({
      valid: newValid
    })

    if (this.props.onChange) {
      this.props.onChange(newValid, this.data)
    }
  }

  reset() {
    this.input.text.value = ""

    this.data = {
      text: ""
    }

    let newValid = false
    this.setState({
      valid: newValid
    })

    return newValid
  }

}
