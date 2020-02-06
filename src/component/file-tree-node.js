import React, { useState, useRef, useCallback } from "react"
import PropTypes from "prop-types"

import path from "path"

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
        let root = (props.root !== "") ? props.root : props.path
        let nodepath = props.path + "/" + child.name
        if (child.file) {
          nodepath = ("link" in child) ? path.join(root, child.link) : nodepath
          return (
            <TreeLeaf
              key={ nodepath }
              path={ nodepath }
              label={ child.name }
              buttons={ props.buttons }
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
              buttons={ props.buttons }
              depth={ props.depth + 1 }
            />
          )
        }
      })
    } catch {
      return <TreeLeaf label="Invalid input data..." />
    }
  }

  return (
    <ul className="list-group text-left text-monospace">
      <button
        className="list-group-item list-group-item-action list-group-item-info rounded-0 py-2"
        type="button"
        data-toggle="collapse"
        data-target={ "#" + id.current.collapse }
        aria-expanded="false"
        aria-controls={ id.current.collapse }
        onClick={ handleClickNode }
      >
        { "-".repeat(props.depth) } { open ? "[-]" : "[+]" } { props.source && props.source.name }
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
  buttons : PropTypes.array,
  depth   : PropTypes.number
}

TreeNode.defaultProps = {
  source  : undefined,
  root    : "",
  path    : "",
  buttons : [],
  depth   : 0
}

export default TreeNode
