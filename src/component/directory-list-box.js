import React, {useEffect, useRef, useReducer} from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import axios from "axios"
import path from "path"

import TreeLeaf from "./tree-leaf.js"
import EmbeddedButton from "./embedded-button.js"

const DirectoryListBox = React.memo(props => {
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0)

  const ls = useRef(undefined)

  useEffect(() => {
    const uri = location.protocol + "//" + location.host + props.path + "?cmd=ls"
    axios.get(uri)
    .then(res => {
      if (!res.data.success) {
        throw new Error("no directory found")
      }
      ls.current = res.data.ls
      forceUpdate()
    })
    .catch(err => {
      alert("Could not view the directory...")
    })
  }, [props.path])

  const handleSelect = e => {
    if (props.onSelect) {
      props.onSelect(e.target.parentNode.title)
    }
  }

  const renderList = () => {
    try {
      return ls.current.children.map(child => {
        let nodepath = props.path + "/" + child.name
        if (child.file) {
          return
        }
        return (
          <TreeLeaf
            key={ nodepath }
            path={ nodepath }
            label={ child.name }
            buttons={ [
              <EmbeddedButton
                key="open"
                label="open"
                title="open"
                on={ true }
                onClick={ handleSelect }
              />
            ] }
          />
        )
      })
    } catch {
      return <TreeLeaf label="Invalid input data..." />
    }
  }

  return (
    <div className={ props.className }>
      <ul className="list-group text-left text-monospace">
      { renderList() }
      </ul>
    </div>
  )
}, (p, n) => {
  return p.path === n.path
})

DirectoryListBox.propTypes = {
  path      : PropTypes.string.isRequired,  // re-rendering property
  className : PropTypes.string,
  onSelect  : PropTypes.func
}

DirectoryListBox.defaultProps = {
  path      : undefined,
  className : "",
  onSelect  : undefined
}

export default DirectoryListBox
