import React, { useState } from "react"
import PropTypes from "prop-types"

const ToggleButton = React.memo(props => {
  const [value, setValue] = useState(props.defaultOn)

  const handleClick = () => {
    if (props.onClick) {
      props.onClick(!value)
    }
    setValue(!value)
  }

  return (
    <div className={ props.className }>
      <label
        className={ `text-monospace ${ !value ? "text-body" : "text-muted" } my-0 mx-1` }
      >
        { props.offLabel }
      </label>
      <button
        type="button"
        className={ `btn ${ value ? "btn-success" : "btn-secondary" } rounded-pill mx-1 py-0 px-1` }
        style={ {"width": "48px" } }
        disabled={ props.disabled }
        onClick={ handleClick }
      >
        <label
          className={ `bg-white rounded-circle ${ value ? "float-right" : "float-left" } my-1 mx-1` }
          style={ {"width": "14px", "height": "14px" } }
        />
      </button>
      <label
        className={ `text-monospace ${ value ? "text-success" : "text-muted" } my-0 mx-1` }
      >
        { props.onLabel }
      </label>
    </div>
  )
})

ToggleButton.propTypes = {
  className : PropTypes.string,
  defaultOn : PropTypes.bool,
  disabled  : PropTypes.bool,
  onClick   : PropTypes.func
}

ToggleButton.defaultProps = {
  className : "my-1 mx-1",
  onLabel   : "on",
  offLabel  : "off",
  defaultOn : false,
  disabled  : false,
  onClick   : undefined
}

export default ToggleButton
