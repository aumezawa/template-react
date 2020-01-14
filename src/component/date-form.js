import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

const DateForm = React.memo(props => {
  const handleChange = e => {
    if (props.onChange) {
      props.onChange(new Date(event.target.value))
    }
  }

  return (
    <div className={ props.className }>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">{ props.label }</span>
        </div>
        <input
          className={ ClassNames({ "form-control": true, "is-invalid": !props.valid }) }
          type="datetime-local"
          step="1"
          disabled={ props.disabled }
          defaultValue={ props.default }
          onChange={ handleChange }
        />
      </div>
    </div>
  )
}, (p, n) => {
  return p.valid === n.valid && p.disabled === n.disabled
})

DateForm.propTypes = {
  valid     : PropTypes.bool.isRequired,  // re-rendering property
  className : PropTypes.string,
  label     : PropTypes.string,
  default   : PropTypes.string,
  disabled  : PropTypes.bool,             // re-rendering property
  onChange  : PropTypes.func
}

DateForm.defaultProps = {
  valid     : undefined,
  className : "mb-3",
  label     : "Date",
  dafault   : (new Date()).toISOString().slice(0, 19),
  disabled  : false,
  onChange  : undefined
}

export default DateForm
