import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import SelectForm from "./select-form.js"
import TextFilterForm from "./text-filter-form.js"
import DateFilterForm from "./date-filter-form.js"

export const TYPE_TEXT = 0
export const TYPE_DATE = 1
export const MODE_INCLUDED     = TextFilterForm.MODE_INCLUDED
export const MODE_NOT_INCLUDED = TextFilterForm.MODE_NOT_INCLUDED
export const MODE_REGEX        = TextFilterForm.MODE_REGEX

const typeOptions = ["Text", "Date"]

export default class ComplexFilterForm extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      valid : false,
      type  : undefined
    }
    this.data = {}
    this.children = {}
  }

  static get propTypes() {
    return ({
      className : PropTypes.string,
      disabled  : PropTypes.bool,
      onChange  : PropTypes.func,
      onSubmit  : PropTypes.func,
      onClear   : PropTypes.func
    })
  }

  static get defaultProps() {
    return ({
      className : "",
      disabled  : false,
      onChange  : undefined,
      onSubmit  : undefined,
      onClear   : undefined
    })
  }

  componentDidMount() {
    this.data.type = this.children.type.data.index
    this.data.mode = this.children.text.data.mode
    this.data.condition = this.children.text.data.condition
    this.data.from = this.children.date.data.from
    this.data.to = this.children.date.data.to
    this.setState({
      valid : this.isValid([]),
      type  : this.data.type
    })
  }

  render() {
    return (
      <div className={ this.props.className }>
        <SelectForm
          ref={ ref => this.children.type = ref }
          label={ "Data Type:" }
          options={ typeOptions }
          disabled={ this.props.disabled }
          onChange={ (v, d) => this.handleChangeType(v, d) }
        />
        <TextFilterForm
          ref={ ref => this.children.text = ref }
          className={ ClassNames({ "d-none": this.state.type !== TYPE_TEXT }) }
          disabled={ this.props.disabled }
          onChange={ (v, d) => this.handleChangeText(v, d) }
        />
        <DateFilterForm
          ref={ ref => this.children.date = ref }
          className={ ClassNames({ "d-none": this.state.type !== TYPE_DATE }) }
          disabled={ this.props.disabled }
          onChange={ (v, d) => this.handleChangeDate(v, d) }
        />
        <div className="form-row justify-content-center">
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-primary"
              disabled={ !this.state.valid }
              onClick={ e => this.handleSubmit(e) }
            >
              Filter
            </button>
          </div>
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={ e => this.handleClear(e) }
            >
              Clear
            </button>
          </div>
        </div>
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

  handleChangeType(v, data) {
    this.data.type = data.index

    let valid = (this.data.type === TYPE_TEXT) ? v && this.isValid(["type", "date"]) : v && this.isValid(["type", "text"])
    this.setState({
      valid : valid,
      type  : this.data.type
    })

    if (this.props.onChange) {
      this.props.onChange(valid, this.data)
    }
  }

  handleChangeText(v, data) {
    this.data.mode = data.mode
    this.data.condition = data.condition

    let valid = v && this.isValid(["text", "date"])
    this.setState({
      valid : valid
    })

    if (this.props.onChange) {
      this.props.onChange(valid, this.data)
    }
  }

  handleChangeDate(v, data) {
    this.data.from = data.from
    this.data.to = data.to

    let valid = v && this.isValid(["text", "date"])
    this.setState({
      valid : valid
    })

    if (this.props.onChange) {
      this.props.onChange(valid, this.data)
    }
  }

  handleSubmit(event) {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.data)
    }
  }

  handleClear(event) {
    if (this.props.onClear) {
      this.props.onClear()
    }
  }

}
