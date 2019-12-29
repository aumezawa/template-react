import React from "react"
import PropTypes from "prop-types"

import SelectForm from "./select-form.js"
import TextForm from "./text-form.js"

export default class TextFilterForm extends React.PureComponent {

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

  static get CONST() {
    return ({
      MODE_INCLUDED     : 0,
      MODE_NOT_INCLUDED : 1,
      MODE_REGEX        : 2
    })
  }

  static get modeOptions() {
    return ["Be included", "Not be included", "Regex"]
  }

  componentDidMount() {
    this.init()
  }

  render() {
    return (
      <div className={ this.props.className }>
        <SelectForm
          ref={ ref => this.children.mode = ref }
          label="Mode:"
          options={ TextFilterForm.modeOptions }
          disabled={ this.props.disabled }
          onChange={ (valid, data) => this.handleChangeMode(valid, data) }
        />
        <TextForm
          ref={ ref => this.children.text = ref }
          label="Condition:"
          disabled={ this.props.disabled }
          onChange={ (valid, data) => this.handleChangeText(valid, data) }
        />
      </div>
    )
  }

  init(newValid = this.isValid()) {
    this.data = {
      mode      : this.children.mode.data.index,
      condition : this.children.text.data.text
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

  handleChangeMode(valid, data) {
    this.data.mode = data.index

    let newValid = this.isValid(valid, ["mode"])
    this.setState({
      valid: newValid
    })

    if (this.props.onChange) {
      this.props.onChange(newValid, this.data)
    }
  }

  handleChangeText(valid, data) {
    this.data.condition = data.text

    let newValid = this.isValid(valid, ["text"])
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
