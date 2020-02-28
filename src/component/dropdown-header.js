import React from "react"
import PropTypes from "prop-types"

const DropdownHeader = props => (
  <div className={ `${ props.className } dropdown-header` }>
    { props.label }
  </div>
)

DropdownHeader.propTypes = {
  className : PropTypes.string,
  label     : PropTypes.string
}

DropdownHeader.defaultProps = {
  className : "",
  label     : "No label"
}

export default DropdownHeader
