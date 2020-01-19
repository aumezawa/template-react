import React, { useCallback } from "react"
import PropTypes from "prop-types"

const TextboxForm = React.memo(React.forwardRef((props, ref) => {
  const valid = (props.valid) ? "" : "is-invalid"

  const handleChange = useCallback(e => {
    if (props.onChange) {
      props.onChange(e.target.value)
    }
  }, [props.onChange])

  return (
    <div className={ props.className }>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">{ props.label }</span>
        </div>
        <textarea
          ref={ ref }
          className={ `form-control text-monospace ${ valid }` }
          rows={ props.rows }
          maxLength={ props.maxLength }
          placeholder={ props.placeholder }
          disabled={ props.disabled }
          onChange={ handleChange }
        >
        </textarea>
      </div>
    </div>
  )
}))

TextboxForm.propTypes = {
  valid       : PropTypes.bool.isRequired,
  className   : PropTypes.string,
  label       : PropTypes.string,
  rows        : PropTypes.number,
  maxLength   : PropTypes.number,
  placeholder : PropTypes.string,
  disabled    : PropTypes.bool,
  onChange    : PropTypes.func
}

TextboxForm.defaultProps = {
  valid       : undefined,
  className   : "mb-3",
  label       : "Text",
  rows        : 3,
  maxLength   : 1024,
  placeholder : "",
  disabled    : false,
  onChange    : undefined
}

export default TextboxForm
