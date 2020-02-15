import React, { useCallback } from "react"
import PropTypes from "prop-types"

const TextForm = React.memo(React.forwardRef((props, ref) => {
  const valid   = (props.valid) ? "" : "is-invalid"
  const display = (props.hidden) ? "d-none" : ""

  const handleChange = useCallback(e => {
    if (props.onChange) {
      props.onChange(e.target.value)
    }
  }, [props.onChange])

  return (
    <div className={ `${ props.className} ${ display }` }>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">{ props.label }</span>
        </div>
        <input
          ref={ ref }
          className={ `form-control text-monospace ${ valid }` }
          type={ props.type }
          disabled={ props.disabled }
          onChange={ handleChange }
        />
      </div>
    </div>
  )
}))

TextForm.propTypes = {
  valid     : PropTypes.bool.isRequired,
  className : PropTypes.string,
  label     : PropTypes.string,
  type      : PropTypes.string,
  disabled  : PropTypes.bool,
  hidden    : PropTypes.bool,
  onChange  : PropTypes.func
}

TextForm.defaultProps = {
  valid     : undefined,
  className : "mb-3",
  label     : "Text",
  type      : "text",
  disabled  : false,
  hidden    : false,
  onChange  : undefined
}

export default TextForm
