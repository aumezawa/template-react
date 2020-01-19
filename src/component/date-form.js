import React, { useCallback } from "react"
import PropTypes from "prop-types"

import LocalDate from "../lib/date.js"

const DateForm = React.memo(props => {
  const valid = (props.valid) ? "" : "is-invalid"

  const handleChange = useCallback(e => {
    if (props.onChange) {
      props.onChange(new Date(event.target.value))
    }
  }, [props.onChange])

  return (
    <div className={ props.className }>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">{ props.label }</span>
        </div>
        <input
          className={ `form-control ${ valid }` }
          type="datetime-local"
          step="1"
          disabled={ props.disabled }
          defaultValue={ props.default }
          onChange={ handleChange }
        />
      </div>
    </div>
  )
})

DateForm.propTypes = {
  valid     : PropTypes.bool.isRequired,
  className : PropTypes.string,
  label     : PropTypes.string,
  default   : PropTypes.string,
  disabled  : PropTypes.bool,
  onChange  : PropTypes.func
}

DateForm.defaultProps = {
  valid     : undefined,
  className : "mb-3",
  label     : "Date",
  default   : LocalDate(9).toISOString().slice(0, 19),
  disabled  : false,
  onChange  : undefined
}

export default DateForm
