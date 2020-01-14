import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

const TextForm = React.memo(React.forwardRef((props, ref) => {
  const handleChange = e => {
    if (props.onChange) {
      props.onChange(e.target.value)
    }
  }

  return (
    <div className={ props.className }>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">{ props.label }</span>
        </div>
        <input
          ref={ ref }
          className={ ClassNames({ "form-control": true, "text-monospace": true, "is-invalid": !props.valid }) }
          type={ props.type }
          disabled={ props.disabled }
          onChange={ handleChange }
        />
      </div>
    </div>
  )
}), (p, n) => {
  return p.valid === n.valid && p.disabled === n.disabled
})

TextForm.propTypes = {
  valid     : PropTypes.bool.isRequired,  // re-rendering property
  className : PropTypes.string,
  label     : PropTypes.string,
  type      : PropTypes.string,
  disabled  : PropTypes.bool,             // re-rendering property
  onChange  : PropTypes.func
}

TextForm.defaultProps = {
  valid     : undefined,
  className : "mb-3",
  label     : "Text",
  type      : "text",
  disabled  : false,
  onChange  : undefined
}

export default TextForm
