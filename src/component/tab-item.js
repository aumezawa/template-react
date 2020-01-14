import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

const TabItem = props => (
  <div
    className={ ClassNames({ "tab-pane": true, "fade": true, "show": props.active, "active": props.active }) }
    id={ props.itemId }
    role="tabpanel"
    aria-labelledby={ props.labelId }
  >
    { props.item }
  </div>
)

TabItem.propTypes = {
  item    : PropTypes.element.isRequired,
  labelId : PropTypes.string.isRequired,
  itemId  : PropTypes.string.isRequired,
  active  : PropTypes.bool
}

TabItem.defaultProps = {
  item    : undefined,
  labelId : undefined,
  itemId  : undefined,
  active  : false
}

export default TabItem
