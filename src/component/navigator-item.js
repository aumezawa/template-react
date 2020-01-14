import React from "react"
import PropTypes from "prop-types"

const NavigatorItem = React.memo(props => (
  <button
    className="dropdown-item"
    type="button"
    disabled={ props.disabled }
    onClick={ () => location.href = props.page }
  >
    { props.label }
  </button>
), (p, n) => true)

NavigatorItem.propTypes = {
  label   : PropTypes.string,
  page    : PropTypes.string,
  disabled: PropTypes.bool
}

NavigatorItem.defaultProps = {
  label   : "Top page",
  page    : "/",
  disabled: false
}

export default NavigatorItem
