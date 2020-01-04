import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import DateFilterForm from "./date-filter-form.js"
import SelectForm from "./select-form.js"
import TextFilterForm from "./text-filter-form.js"

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

  static get CONST() {
    return ({
      TYPE_TEXT         : 0,
      TYPE_DATE         : 1,
      MODE_INCLUDED     : TextFilterForm.CONST.MODE_INCLUDED,
      MODE_NOT_INCLUDED : TextFilterForm.CONST.MODE_NOT_INCLUDED,
      MODE_REGEX        : TextFilterForm.CONST.MODE_REGEX
    })
  }

  static get typeOptions() {
    return ["Text", "Date"]
  }

  componentDidMount() {
    this.init()
  }

  render() {
    return (
      <div className={ this.props.className }>
        <SelectForm
          ref={ ref => this.children.type = ref }
          label={ "Data Type:" }
          options={ ComplexFilterForm.typeOptions }
          disabled={ this.props.disabled }
          onChange={ (valid, data) => this.handleChangeType(valid, data) }
        />
        <TextFilterForm
          ref={ ref => this.children.text = ref }
          className={ ClassNames({ "d-none": this.state.type !== ComplexFilterForm.CONST.TYPE_TEXT }) }
          disabled={ this.props.disabled }
          onChange={ (valid, data) => this.handleChangeText(valid, data) }
        />
        <DateFilterForm
          ref={ ref => this.children.date = ref }
          className={ ClassNames({ "d-none": this.state.type !== ComplexFilterForm.CONST.TYPE_DATE }) }
          disabled={ this.props.disabled }
          onChange={ (valid, data) => this.handleChangeDate(valid, data) }
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

  init(newValid = this.isValid()) {
    this.data = {
      type      : this.children.type.data.index,
      mode      : this.children.text.data.mode,
      condition : this.children.text.data.condition,
      from      : this.children.date.data.from,
      to        : this.children.date.data.to
    }
    this.setState({
      valid : newValid,
      type  : this.data.type
    })
    return newValid
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

  handleChangeType(valid, data) {
    this.data.type = data.index

    let newValid
    if (this.data.type === ComplexFilterForm.CONST.TYPE_TEXT) {
      newValid = this.isValid(valid, ["type", "date"])
    } else {
      newValid = this.isValid(valid, ["type", "text"])
    }
    this.setState({
      valid : newValid,
      type  : this.data.type
    })

    if (this.props.onChange) {
      this.props.onChange(newValid, this.data)
    }
  }

  handleChangeText(valid, data) {
    this.data.mode = data.mode
    this.data.condition = data.condition

    let newValid = this.isValid(valid, ["text", "date"])
    this.setState({
      valid : newValid
    })

    if (this.props.onChange) {
      this.props.onChange(newValid, this.data)
    }
  }

  handleChangeDate(valid, data) {
    this.data.from = data.from
    this.data.to = data.to

    let newValid = this.isValid(valid, ["text", "date"])
    this.setState({
      valid : newValid
    })

    if (this.props.onChange) {
      this.props.onChange(newValid, this.data)
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

  reset() {
    return this.init(Object.keys(this.children).reduce((acc, key) => {
      return this.children[key].reset() && acc
    }, true))
  }

}
