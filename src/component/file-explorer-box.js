import React, { useEffect, useRef, useCallback, useReducer } from "react"
import PropTypes from "prop-types"

import axios from "axios"
import path from "path"

import DropdownItem from "./dropdown-item.js"
import TreeNode from "./file-tree-node.js"

const FileExplorerBox = React.memo(props => {
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0)

  const ls = useRef({})

  useEffect(() => {
    if (props.path === "") {
      return
    }
    const cmd = (props.mode === "directory") ? "ls" : "vft"
    const uri = location.protocol + "//" + location.host + props.path + "?cmd=" + cmd
    axios.get(uri)
    .then(res => {
      if (!res.data.success) {
        throw new Error("no directory found")
      }
      ls.current = res.data.ls
      forceUpdate()
      return
    })
    .catch(err => {
      //alert("Could not view the directory...")
      return
    })
  }, [props.path, props.mode])

  const handleClickView = useCallback(data => {
    if (props.onSelect) {
      props.onSelect({
        action: "view",
        path  : data.parent
      })
    }
  }, [props.onSelect])

  const handleClickViewInTerminal = useCallback(data => {
    if (props.onSelect) {
      props.onSelect({
        action: "viewInTerminal",
        path  : data.parent
      })
    }
  }, [props.onSelect])

  const handleClickDownload = useCallback(data => {
    const filepath = data.parent
    const uri = location.protocol + "//" + location.host + filepath
    axios.get(uri, {
      responseType: "blob"
    })
    .then(res => {
      let link = document.createElement("a")
      link.href = URL.createObjectURL(new Blob([res.data]))
      link.setAttribute("download", path.basename(filepath))
      document.body.appendChild(link)
      link.click()
    })
    .catch(err => {
      alert("Could not download the file...")
    })
  }, [true])

  const handleClickDebugger = useCallback(data => {
    if (props.onSelect) {
      props.onSelect({
        action: "debugger",
        path  : data.parent
      })
    }
  }, [true])

  const isDisplayView = useCallback(data => {
      if ("type" in data.child) {
        if (data.child.type !== "bin" && data.child.type !== "dmp") {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
  }, [true])

  const isDisplayDownload = useCallback(data => true, [true])

  const isDisplayDebugger = useCallback(data => {
    if ("type" in data.child) {
      if  (data.child.type === "dmp") {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }, [true])

  return (
    <div className={ props.className }>
      <TreeNode
        source={ ls.current }
        path={ props.path }
        items={ [
          <DropdownItem
            key="view"
            label="view"
            onClick={ handleClickView }
          />,
          <DropdownItem
            key="viewInTerminal"
            label="view in terminal"
            onClick={ handleClickViewInTerminal }
          />,
          <DropdownItem
            key="download"
            label="download"
            onClick={ handleClickDownload }
          />,
          <DropdownItem
            key="debugger"
            label="debugger"
            onClick={ handleClickDebugger }
          />
        ] }
        display={ [isDisplayView, isDisplayView, isDisplayDownload, isDisplayDebugger] }
      />
    </div>
  )
})

FileExplorerBox.propTypes = {
  className : PropTypes.string,
  path      : PropTypes.string,
  mode      : PropTypes.string,
  onSelect  : PropTypes.func
}

FileExplorerBox.defaultProps = {
  className : "",
  path      : "",
  mode      : "directory",
  onSelect  : undefined
}

export default FileExplorerBox
