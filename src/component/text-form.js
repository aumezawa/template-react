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
  }

  static get propTypes() {
    return ({
      label     : PropTypes.string,
      className : PropTypes.string,
      disabled  : PropTypes.bool,
      onChange  : PropTypes.func,
      validate  : PropTypes.func
    })
  }

  static get defaultProps() {
    return ({
      label     : "Text:",
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
            className={ ClassNames({ "form-control": true, "text-monospace": true, "is-invalid": !this.state.valid }) }
            type="text"
            disabled={ this.props.disabled }
            onChange={ e => this.handleChangeText(e) }
          />
        </div>
      </div>
    )
  }

  isValid() {
    let valid = true
    if (this.data.text === "") {
      valid = false
    }
    if (this.props.validate && !this.props.validate(this.data.text)) {
      valid = false
    }
    return valid
  }

  handleChangeText(event) {
    this.data.text = event.target.value

    let valid = this.isValid()
    this.setState({
      valid: valid
    })

    if (this.props.onChange) {
      this.props.onChange(valid, this.data)
    }
  }

}
