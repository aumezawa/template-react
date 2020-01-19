import React, { useCallback } from "react"
import PropTypes from "prop-types"

const EmbeddedButton = React.memo(props => {
  const color = (props.on) ? "badge-success" : "badge-light"

  const handleClick = useCallback(e => {
    if (props.onClick) {
      props.onClick(e)
    }
  }, [props.onClick])

  return (
    <>
      { "  " }
      <span
        className={ `badge badge-btn ${ color }` }
        title={ props.title }
        data-toggle={ props.toggle }
        data-target={ "#" + props.target }
        onClick={ handleClick }
      >
        { props.label }
      </span>
    </>
  )
})

EmbeddedButton.propTypes = {
  label   : PropTypes.string,
  title   : PropTypes.string,
  on      : PropTypes.bool,
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
