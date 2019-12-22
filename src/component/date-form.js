import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

export default class DateForm extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      valid: true
    }
    this.data = {
      date: new Date()
    }
    this.defaultDate = this.data.date.toISOString().slice(0, 19)
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
      label     : "Date:",
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
            className={ ClassNames({ "form-control": true, "is-invalid": !this.state.valid }) }
            type="datetime-local"
            step="1"
            disabled={ this.props.disabled }
            defaultValue={ this.defaultDate }
            onChange={ e => this.handleChangeDate(e) }
          />
        </div>
      </div>
    )
  }

  isValid() {
    let valid = true
    if (this.data.date.toString() === "Invalid Date") {
      valid = false
    }
    if (this.props.validate && !this.props.validate(this.data.date)) {
      valid = false
    }
    return valid
  }

  handleChangeDate(event) {
    this.data.date = new Date(event.target.value)

    let valid = this.isValid()
    this.setState({
      valid: valid
    })

    if (this.props.onChange) {
      this.props.onChange(valid, this.data)
    }
  }

}
