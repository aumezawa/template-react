import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

const TabLabel = props => (
  <li className="nav-item">
    <a
      className={ ClassNames({ "nav-link": true, "active": props.active }) }
      id={ props.labelId }
      data-toggle="tab"
      href={ "#" + props.itemId }
      role="tab"
      aria-controls={ props.itemId }
      aria-selected="true"
    >
      { props.label }
    </a>
  </li>
)

TabLabel.propTypes = {
  label   : PropTypes.string.isRequired,
  labelId : PropTypes.string.isRequired,
  itemId  : PropTypes.string.isRequired,
  active  : PropTypes.bool
}

TabLabel.defaultProps = {
  label   : undefined,
  labelId : undefined,
  itemId  : undefined,
  active  : false
}

export default TabLabel
