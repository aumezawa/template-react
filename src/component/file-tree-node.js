import React, { useState, useRef, useCallback } from "react"
import PropTypes from "prop-types"

import TreeLeaf from "./file-tree-leaf.js"

import uniqueId from "../lib/uniqueId.js"

const TreeNode = props => {
  const [open, setOpen] = useState(false)

  const id = useRef({
    collapse: "collapse-" + uniqueId()
  })

  const handleClickNode = useCallback(() => {
    setOpen(!open)
  }, [open])

  const renderChildren = () => {
    try {
      return props.source.children.map(child => {
        const root = (props.root !== "") ? props.root : props.path
        const items = props.items.map((item, index) => props.display[index]({ child: child }) ? item : undefined)
        let nodepath = props.path + "/" + child.name
        if (child.file) {
          nodepath = ("link" in child) ? (root + "/" + child.link) : nodepath
          return (
            <TreeLeaf
              key={ nodepath }
              path={ nodepath }
              label={ child.name }
              items={ items }
              depth={ props.depth + 1 }
            />
          )
        } else {
          return (
            <TreeNode
              key={ nodepath }
              source={ child }
              root={ root }
              path={ nodepath }
              items={ props.items }
              display={ props.display }
              depth={ props.depth + 1 }
            />
          )
        }
      })
    } catch (err) {
      return <TreeLeaf label="Invalid input data..." />
    }
  }

  return (
    <ul className="list-group text-left text-monospace">
      <button
        className="d-flex flex-row list-group-item list-group-item-action list-group-item-info rounded-0 py-0 px-0"
        type="button"
        data-toggle="collapse"
        data-target={ "#" + id.current.collapse }
        aria-expanded="false"
        aria-controls={ id.current.collapse }
        onClick={ handleClickNode }
      >
      <div className="my-2 ml-3 mr-1">
        { "-".repeat(props.depth) }
      </div>
      <div className="my-2 mr-1">
        { open ? "[-]" : "[+]" }
      </div>
      <div className="flex-grow-1 my-2 mr-3">
        { props.source && props.source.name }
      </div>
      </button>
      <ul className="list-group collapse" id={ id.current.collapse }>
        { renderChildren() }
      </ul>
    </ul>
  )
}

TreeNode.propTypes = {
  source  : PropTypes.object,
  root    : PropTypes.string,
  path    : PropTypes.string,
  items   : PropTypes.array,
  display : PropTypes.array,
  depth   : PropTypes.number
}

TreeNode.defaultProps = {
  source  : undefined,
  root    : "",
  path    : "",
  items   : [],
  display : [],
  depth   : 0
}

export default TreeNode
