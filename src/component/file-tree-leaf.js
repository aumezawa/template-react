import React from "react"
import PropTypes from "prop-types"

const TreeLeaf = props => (
  <li
    className="list-group-item list-group-item-action list-group-item-light rounded-0 py-2"
    title={ props.path }
  >
    { "-".repeat(props.depth) } { props.label } { props.buttons }
  </li>
)

TreeLeaf.propTypes = {
  path    : PropTypes.string,
  label   : PropTypes.string,
  button  : PropTypes.array,
  depth   : PropTypes.number
}

TreeLeaf.defaultProps = {
  path    : "",
  label   : "Leaf",
  buttons : [],
  depth   : 0
}

export default TreeLeaf
