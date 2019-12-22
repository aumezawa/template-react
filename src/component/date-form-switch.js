import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

export default class DateFormSwitch extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      valid   : true,
      enabled : this.props.defaultValue
    }
    this.data = {
      date    : new Date(),
      valid   : this.props.defaultValue
    }
    this.defaultDate = this.data.date.toISOString().slice(0, 19)
  }

  static get propTypes() {
    return ({
      label       : PropTypes.string,
      className   : PropTypes.string,
      disabled    : PropTypes.bool,
      defaultValue: PropTypes.bool,
      onChange    : PropTypes.func,
      validate    : PropTypes.func
    })
  }

  static get defaultProps() {
    return ({
      label       : "Date:",
      className   : "",
      disabled    : false,
      defaultValue: true,
      onChange    : undefined,
      validate    : undefined
    })
  }

  render() {
    return (
      <div className={ this.props.className }>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">{ this.props.label }</span>
            <span className="input-group-text">
              <input type="checkbox" defaultChecked={ this.props.defaultValue } onChange={ e => this.handleChangeCheck(e) }></input>
            </span>
          </div>
          <input
            className={ ClassNames({ "form-control": true, "is-invalid": !this.state.valid }) }
            type="datetime-local"
            step="1"
            disabled={ this.props.disabled || !this.state.enabled }
            defaultValue={ this.defaultDate }
            onChange={ e => this.handleChangeDate(e) }
          />
        </div>
      </div>
    )
  }

  isValid(enabled) {
    let valid = true
    if (enabled) {
      if (this.data.date.toString() === "Invalid Date") {
        valid = false
      }
      if (this.props.validate && !this.props.validate(this.data.date)) {
        valid = false
      }
    }
    return valid
  }

  handleChangeCheck(event) {
    let enabled = !this.state.enabled

    this.data.valid = enabled

    let valid = this.isValid(enabled)
    this.setState({
      valid   : valid,
      enabled : enabled
    })

    if (this.props.onChange) {
      this.props.onChange(valid, this.data)
    }
  }

  handleChangeDate(event) {
    this.data.date = new Date(event.target.value)

    let valid = this.isValid(this.state.enabled)
    this.setState({
      valid: valid
    })

    if (this.props.onChange) {
      this.props.onChange(valid, this.data)
    }
  }

}
