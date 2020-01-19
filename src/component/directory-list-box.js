import React, { useEffect, useRef, useCallback, useReducer } from "react"
import PropTypes from "prop-types"

import axios from "axios"
import path from "path"

import EmbeddedButton from "./embedded-button.js"
import TreeLeaf from "./tree-leaf.js"

const DirectoryListBox = React.memo(props => {
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0)

  const ls = useRef([])

  useEffect(() => {
    if (props.path === "") {
      return
    }
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

  const handleSelect = useCallback(e => {
    if (props.onSelect) {
      props.onSelect(e.target.parentNode.title)
    }
  }, [props.onSelect])

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
})

DirectoryListBox.propTypes = {
  className : PropTypes.string,
  path      : PropTypes.string,
  onSelect  : PropTypes.func
}

DirectoryListBox.defaultProps = {
  className : "",
  path      : undefined,
  onSelect  : undefined
}

export default DirectoryListBox
