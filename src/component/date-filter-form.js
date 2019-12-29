import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import DateForm from "./date-form.js"

export default class DateFilterForm extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      valid : false
    }
    this.data = {}
    this.children = {}
  }

  static get propTypes() {
    return ({
      className : PropTypes.string,
      disabled  : PropTypes.bool,
      onChange  : PropTypes.func
    })
  }

  static get defaultProps() {
    return ({
      className : "",
      disabled  : false,
      onChange  : undefined
    })
  }

  componentDidMount() {
    this.init()
  }

  render() {
    return (
      <div className={ this.props.className }>
        <DateForm
          ref={ ref => this.children.from = ref }
          label="From:"
          muteable={ true }
          disabled={ this.props.disabled }
          onChange={ (valid, date) => this.handleChangeFrom(valid, date) }
        />
        <DateForm
          ref={ ref => this.children.to = ref }
          label="To:"
          muteable={ true }
          disabled={ this.props.disabled }
          onChange={ (valid, date) => this.handleChangeTo(valid, date) }
        />
      </div>
    )
  }

  init(newValid = this.isValid()) {
    this.data = {
      from: this.children.from.data.valid ? this.children.from.data.date : new Date("Invalid Date"),
      to  : this.children.to.data.valid ? this.children.to.data.date : new Date("Invalid Date")
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

  handleChangeFrom(valid, data) {
    this.data.from = data.valid ? data.date : new Date("Invalid Date")

    let newValid = this.isValid(valid, ["from"])
    this.setState({
      valid: newValid
    })

    if (this.props.onChange) {
      this.props.onChange(newValid, this.data)
    }
  }

  handleChangeTo(valid, data) {
    this.data.to = data.valid ? data.date : new Date("Invalid Date")

    let newValid = this.isValid(valid, ["to"])
    this.setState({
      valid: newValid
    })

    if (this.props.onChange) {
      this.props.onChange(newValid, this.data)
    }
  }

  reset() {
    this.init(Object.keys(this.children).reduce((acc, key) => {
      return this.children[key].reset() && acc
    }, true))
  }

}
