import React, { useCallback } from "react"
import PropTypes from "prop-types"

const DropdownItem = props => {

  const handleClickItem = useCallback(e => {
    if (props.onClick) {
      props.onClick({
        parent: e.target.parentNode.title,
        target: e.target.title
      })
    }
  }, [props.onClick])

  return (
    <button
      className={ `${ props.className } dropdown-item text-monospace` }
      type="button"
      title={ props.title }
      disabled={ props.disabled }
      data-toggle={ props.toggle }
      data-target={ "#" + props.target }
      onClick={ handleClickItem }
    >
      { props.label }
    </button>
  )
}

DropdownItem.propTypes = {
  className : PropTypes.string,
  label     : PropTypes.string,
  title     : PropTypes.string,
  disabled  : PropTypes.bool,
  toggle    : PropTypes.string,
  target    : PropTypes.string,
  onClick   : PropTypes.func
}

DropdownItem.defaultProps = {
  className : "",
  label     : "action",
  title     : "",
  disabled  : false,
  toggle    : "",
  target    : "",
  onClick   : undefined
}

export default DropdownItem
