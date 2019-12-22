import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import DateFormSwitch from "./date-form-switch.js"

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
    this.data.from = this.children.from.data.valid ? this.children.from.data.date : new Date("Invalid Date")
    this.data.to = this.children.to.data.valid ? this.children.to.data.date : new Date("Invalid Date")
    this.setState({
      valid: this.isValid([])
    })
  }

  render() {
    return (
      <div className={ this.props.className }>
        <DateFormSwitch
          ref={ ref => this.children.from = ref }
          label="From:"
          disabled={ this.props.disabled }
          onChange={ (v, d) => this.handleChangeFrom(v, d) }
        />
        <DateFormSwitch
          ref={ ref => this.children.to = ref }
          label="To:"
          disabled={ this.props.disabled }
          onChange={ (v, d) => this.handleChangeTo(v, d) }
        />
      </div>
    )
  }

  isValid(exceptKeys) {
    let valid = true
    Object.keys(this.children).forEach(key => {
      if (exceptKeys.indexOf(key) === -1) {
        valid = valid && this.children[key].state.valid
      }
    })
    return valid
  }

  handleChangeFrom(v, data) {
    this.data.from = data.valid ? data.date : new Date("Invalid Date")

    let valid = v && this.isValid(["from"])
    this.setState({
      valid: valid
    })

    if (this.props.onChange) {
      this.props.onChange(valid, this.data)
    }
  }

  handleChangeTo(v, data) {
    this.data.to = data.valid ? data.date : new Date("Invalid Date")

    let valid = v && this.isValid(["to"])
    this.setState({
      valid: valid
    })

    if (this.props.onChange) {
      this.props.onChange(valid, this.data)
    }
  }

}
