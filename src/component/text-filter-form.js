import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import SelectForm from "./select-form.js"
import TextForm from "./text-form.js"

export const MODE_INCLUDED     = 0
export const MODE_NOT_INCLUDED = 1
export const MODE_REGEX        = 2

const modeOptions = ["Be included", "Not be included", "Regex"]

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

  componentDidMount() {
    this.data.mode = this.children.mode.data.index
    this.data.condition = this.children.text.data.text
    this.setState({
      valid: this.isValid([])
    })
  }

  render() {
    return (
      <div className={ this.props.className }>
        <SelectForm ref={ ref => this.children.mode = ref } label="Mode:" options={ modeOptions } disabled={ this.props.disabled } onChange={ (v, d) => this.handleChangeMode(v, d) } />
        <TextForm ref={ ref => this.children.text = ref } label="Condition:" disabled={ this.props.disabled } onChange={ (v, d) => this.handleChangeText(v, d) } />
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

  handleChangeMode(v, data) {
    this.data.mode = data.index

    let valid = v && this.isValid(["mode"])
    this.setState({
      valid: valid
    })

    if (this.props.onChange) {
      this.props.onChange(valid, this.data)
    }
  }

  handleChangeText(v, data) {
    this.data.condition = data.text

    let valid = v && this.isValid(["text"])
    this.setState({
      valid: valid
    })

    if (this.props.onChange) {
      this.props.onChange(valid, this.data)
    }
  }

}
