import React, {useState, useRef} from "react"
import PropTypes from "prop-types"

import TreeLeaf from "./tree-leaf.js"

import uniqueId from "../lib/uniqueId.js"

const TreeNode = React.memo(props => {
  const [open, setOpen] = useState(false)

  const id = useRef({
    collapse: "collapse-" + uniqueId()
  })

  const handleClickNode = () => {
    setOpen(!open)
  }

  const renderChildren = () => {
    try {
      return props.isChild(props.source).map(child => {
        let nodepath = props.path + "/" + props.isName(child)
        if (props.isLeaf(child)) {
          return (
            <TreeLeaf
              key={ nodepath }
              path={ nodepath }
              label={ props.isName(child) }
              buttons={ props.buttons }
              depth={ props.depth + 1 }
            />
          )
        } else {
          return (
            <TreeNode
              key={ nodepath }
              source={ child }
              isName={ props.isName }
              isLeaf={ props.isLeaf }
              isChild={ props.isChild }
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
        { "-".repeat(props.depth) } { open ? "[-]" : "[+]" } { props.source && props.isName(props.source) }
      </button>
      <ul className="list-group collapse" id={ id.current.collapse }>
        { renderChildren() }
      </ul>
    </ul>
  )
}, (p, n) => {
  return p.source === n.source
})

TreeNode.propTypes = {
  source  : PropTypes.object,           // re-rendering property
  isName  : PropTypes.func.isRequired,
  isLeaf  : PropTypes.func.isRequired,
  isChild : PropTypes.func.isRequired,
  path    : PropTypes.string,
  buttons : PropTypes.array,
  depth   : PropTypes.number
}

TreeNode.defaultProps = {
  source  : undefined,
  isName  : undefined,
  isLeaf  : undefined,
  isChild : undefined,
  path    : "",
  buttons : [],
  depth   : 0
}

export default TreeNode
