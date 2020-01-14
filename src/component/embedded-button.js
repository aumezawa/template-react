import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

const EmbeddedButton = React.memo(props => {
  const handleClick = e => {
    if (props.onClick) {
      props.onClick(e)
    }
  }

  return (
    <>
      { "  " }
      <span
        className={ ClassNames({ "badge": true, "badge-btn": true, "badge-success": props.on, "badge-light": !props.on }) }
        title={ props.title }
        data-toggle={ props.toggle }
        data-target={ "#" + props.target }
        onClick={ handleClick }
      >
        { props.label }
      </span>
    </>
  )
}, (p, n) => {
  return p.on === n.on
})

EmbeddedButton.propTypes = {
  label   : PropTypes.string,
  title   : PropTypes.string,
  on      : PropTypes.bool,     // re-rendering property
  toggle  : PropTypes.string,
  target  : PropTypes.string,
  onClick : PropTypes.func
}

EmbeddedButton.defaultProps = {
  label   : "button",
  title   : "",
  on      : false,
  toggle  : "",
  target  : "",
  onClick : undefined
}

export default EmbeddedButton
