import React, { useRef } from "react"
import PropTypes from "prop-types"

import DropdownButton from "./dropdown-button.js"

import uniqueId from "../lib/uniqueId.js"

const TreeLeaf = props => {
  const id = useRef({
    drop: uniqueId()
  })

  return (
    <li className="d-flex flex-row list-group-item list-group-item-action list-group-item-light rounded-0 py-0 px-0">
      <div className="text-nowrap my-2 ml-3 mr-1">
        { "-".repeat(props.depth) }
      </div>
      <div className="flex-grow-1 text-break my-2">
        { props.label }
      </div>
      <DropdownButton
        title={ props.path }
        items={ props.items }
      />
    </li>
  )
}

TreeLeaf.propTypes = {
  path    : PropTypes.string,
  label   : PropTypes.string,
  items   : PropTypes.array,
  depth   : PropTypes.number
}

TreeLeaf.defaultProps = {
  path    : "",
  label   : "Leaf",
  items   : [],
  depth   : 0
}

export default TreeLeaf
