import React from "react"
import PropTypes from "prop-types"

const DropdownDivider = props => (
  <div className={ `${ props.className } dropdown-divider` }></div>
)

DropdownDivider.propTypes = {
  className : PropTypes.string
}

DropdownDivider.defaultProps = {
  className : ""
}

export default DropdownDivider
