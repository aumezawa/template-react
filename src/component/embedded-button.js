import React, { useCallback } from "react"
import PropTypes from "prop-types"

const EmbeddedButton = React.memo(props => {
  const color   = (props.on)      ? "badge-success" : "badge-light"
  const margin  = (props.margin)  ? "mx-3"          : ""

  const handleClick = useCallback(e => {
    if (props.onClick) {
      props.onClick({
        parent: e.target.parentNode.title,
        target: e.target.title
      })
    }
  }, [props.onClick])

  return (
    <>
      <span
        className={ `badge badge-btn ${ color } ${ margin }` }
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
  margin  : PropTypes.bool,
  toggle  : PropTypes.string,
  target  : PropTypes.string,
  onClick : PropTypes.func
}

EmbeddedButton.defaultProps = {
  label   : "button",
  title   : "",
  on      : false,
  margin  : false,
  toggle  : "",
  target  : "",
  onClick : undefined
}

export default EmbeddedButton
