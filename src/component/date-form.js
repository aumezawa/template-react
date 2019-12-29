import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

export default class DateForm extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      valid   : true,
      enabled : !this.props.defaultMute
    }
    this.data = {
      date    : new Date(),
      valid   : !this.props.defaultMute
    }
    this.defaultDate = this.data.date.toISOString().slice(0, 19)
  }

  static get propTypes() {
    return ({
      label       : PropTypes.string,
      className   : PropTypes.string,
      muteable    : PropTypes.bool,
      disabled    : PropTypes.bool,
      defaultMute : PropTypes.bool,
      onChange    : PropTypes.func,
      validate    : PropTypes.func
    })
  }

  static get defaultProps() {
    return ({
      label       : "Date:",
      className   : "",
      muteable    : false,
      disabled    : false,
      defaultMute : false,
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
            <span className={ ClassNames({ "input-group-text": true, "d-none": !this.props.muteable }) }>
              <input
                type="checkbox"
                defaultChecked={ !this.props.defaultMute }
                onChange={ e => this.handleChangeCheck(e) }
              />
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

  isValid() {
    if (this.data.valid) {
      if (this.data.date.toString() === "Invalid Date") {
        return false
      }
      if (this.props.validate && !this.props.validate(this.data.date)) {
        return false
      }
    }
    return true
  }

  handleChangeCheck(event) {
    this.data.valid = !this.state.enabled

    let newValid = this.isValid()
    let newEnabled = !this.state.enabled
    this.setState({
      valid   : newValid,
      enabled : newEnabled
    })

    if (this.props.onChange) {
      this.props.onChange(newValid, this.data)
    }
  }

  handleChangeDate(event) {
    this.data.date = new Date(event.target.value)

    let newValid = this.isValid()
    this.setState({
      valid: newValid
    })

    if (this.props.onChange) {
      this.props.onChange(newValid, this.data)
    }
  }

  reset() {
    let newValid = this.state.valid
    return newValid
  }

}
