import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

export default class SelectForm extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      valid: this.props.validate ? this.props.validate(0) : true
    }
    this.data = {
      index: 0
    }
    this.input = {}
  }

  static get propTypes() {
    return ({
      label     : PropTypes.string,
      options   : PropTypes.array.isRequired,
      className : PropTypes.string,
      disabled  : PropTypes.bool,
      onChange  : PropTypes.func,
      validate  : PropTypes.func
    })
  }

  static get defaultProps() {
    return ({
      label     : "Select:",
      options   : undefined,
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
          <select
            ref={ ref => this.input.select = ref }
            className={ ClassNames({ "form-control": true, "is-invalid": !this.state.valid }) }
            disabled={ this.props.disabled }
            onChange={ e => this.handleChangeSelect(e) }
          >
            {
              this.props.options.map((value, index) => {
                return <option key={ index } value={ index }>{ value }</option>
              })
            }
          </select>
        </div>
      </div>
    )
  }

  isValid() {
    if (this.props.validate && !this.props.validate(this.data.index)) {
      return false
    }
    return true
  }

  handleChangeSelect(event) {
    this.data.index = Number(event.target.value)

    let newValid = this.isValid()
    this.setState({
      valid: newValid
    })

    if (this.props.onChange) {
      this.props.onChange(newValid, this.data)
    }
  }

  reset() {
    this.input.select.value = "0"

    this.data = {
      index: 0
    }

    let newValid = this.props.validate ? this.props.validate(0) : true
    this.setState({
      valid: newValid
    })

    return newValid
  }

}
