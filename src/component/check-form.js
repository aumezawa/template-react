import React, { useCallback } from "react"
import PropTypes from "prop-types"

const CheckForm = React.memo(React.forwardRef((props, ref) => {
  const handleChange = useCallback(e => {
    if (props.onChange) {
      props.onChange(e.target.checked)
    }
  }, [props.onChange])

  return (
    <div className={ props.className }>
      <div className="input-group">
        <div className="input-group-prepend">
          <div className="input-group-text">
            <input ref={ ref } type="checkbox" disabled={ props.disabled } defaultChecked={ props.dafault } onChange={ handleChange } />
          </div>
        </div>
        <div className="input-group-append">
          <span className="input-group-text">{ props.label }</span>
        </div>
      </div>
    </div>
  )
}))

CheckForm.propTypes = {
  className : PropTypes.string,
  label     : PropTypes.string,
  dafault   : PropTypes.bool,
  disabled  : PropTypes.bool,
  onChange  : PropTypes.func
}

CheckForm.defaultProps = {
  className : "mb-3",
  label     : "Check",
  dafault   : true,
  disabled  : false,
  onChange  : undefined
}

export default CheckForm
