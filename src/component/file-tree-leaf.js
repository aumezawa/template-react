import React, { useRef } from "react"
import PropTypes from "prop-types"

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
      <div className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle h-100 rounded-0"
          type="button"
          id={ id.current.drop }
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
        </button>
        <div className="dropdown-menu" aria-labelledby={ id.current.drop } title={ props.path }>
          { props.items }
        </div>
      </div>
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
