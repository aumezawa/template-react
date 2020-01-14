import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

const SelectForm = React.memo(React.forwardRef((props, ref) => {
  const handleChange = e => {
    if (props.onChange) {
      props.onChange(Number(e.target.value))
    }
  }

  const options = props.options.map((value, index) => {
    return <option key={ value } value={ index }>{ value }</option>
  })

  return (
    <div className={ props.className }>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">{ props.label }</span>
        </div>
        <select
          ref={ ref }
          className={ ClassNames({ "form-control": true, "is-invalid": !props.valid }) }
          disabled={ props.disabled }
          onChange={ handleChange }
        >
          { options }
        </select>
      </div>
    </div>
  )
}), (p, n) => {
  return p.valid === n.valid && p.disabled === n.disabled
})

SelectForm.propTypes = {
  valid     : PropTypes.bool.isRequired,  // re-rendering property
  options   : PropTypes.array.isRequired,
  className : PropTypes.string,
  label     : PropTypes.string,
  disabled  : PropTypes.bool,             // re-rendering property
  onChange  : PropTypes.func
}

SelectForm.defaultProps = {
  valid     : undefined,
  options   : undefined,
  className : "mb-3",
  label     : "Select",
  disabled  : false,
  onChange  : undefined
}

export default SelectForm
