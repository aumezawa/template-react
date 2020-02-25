import React, { useCallback } from "react"
import PropTypes from "prop-types"

const SelectForm = React.memo(React.forwardRef((props, ref) => {
  const valid = (props.valid) ? "" : "is-invalid"

  const handleChange = useCallback(e => {
    if (props.onChange) {
      props.onChange(Number(e.target.value))
    }
  }, [props.onChange])

  return (
    <div className={ props.className }>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">{ props.label }</span>
        </div>
        <select
          ref={ ref }
          className={ `form-control ${ valid } ` }
          disabled={ props.disabled }
          onChange={ handleChange }
        >
          { props.options.map((value, index) => <option key={ value } value={ index } defaultValue={ index === props.default } >{ value }</option>) }
        </select>
      </div>
    </div>
  )
}))

SelectForm.propTypes = {
  className : PropTypes.string,
  label     : PropTypes.string,
  options   : PropTypes.array.isRequired,
  valid     : PropTypes.bool.isRequired,
  disabled  : PropTypes.bool,
  default   : PropTypes.number,
  onChange  : PropTypes.func
}

SelectForm.defaultProps = {
  className : "mb-3",
  label     : "Select",
  options   : undefined,
  valid     : undefined,
  disabled  : false,
  default   : 0,
  onChange  : undefined
}

export default SelectForm
