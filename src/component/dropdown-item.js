import React, { useCallback } from "react"
import PropTypes from "prop-types"

const DropdownItem = props => {

  const handleClickItem = useCallback(e => {
    if (props.onClick) {
      props.onClick(e)
    }
  }, [props.onClick])

  return (
    <button
      className="dropdown-item"
      type="button"
      disabled={ props.disabled }
      onClick={ handleClickItem }
    >
      { props.label }
    </button>
  )
}

DropdownItem.propTypes = {
  label   : PropTypes.string,
  disabled: PropTypes.bool,
  onClick : PropTypes.func
}

DropdownItem.defaultProps = {
  label   : "action",
  disabled: false,
  onClick : undefined
}

export default DropdownItem
