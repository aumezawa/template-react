import React, {useEffect, useRef, useReducer} from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import axios from "axios"
import path from "path"

import TreeNode from "./tree-node.js"
import EmbeddedButton from "./embedded-button.js"

const FileExplorerBox = React.memo(props => {
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0)

  const ls = useRef(undefined)

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

  const handleClickView = e => {
    const filepath = e.target.parentNode.title
    const uri = location.protocol + "//" + location.host + filepath + "?cmd=jat"

    axios.get(uri)
    .then(res => {
      if (!res.data.success) {
        throw new Error("no file found")
      }
      if (props.onView) {
        props.onView({
          filename: path.basename(filepath),
          content : res.data.table
        })
      }
    })
    .catch(err => {
      alert("Could not view the file...")
    })
  }

  const handleClickDownload = e => {
    const filepath = e.target.parentNode.title
    const uri = location.protocol + "//" + location.host + filepath
    axios.get(uri, {
      responseType: "blob"
    })
    .then(res => {
      const link = document.createElement("a")
      link.href = URL.createObjectURL(new Blob([res.data]))
      link.setAttribute("download", path.basename(filepath))
      document.body.appendChild(link)
      link.click()
    })
    .catch(err => {
      alert("Could not download the file...")
    })
  }

  return (
    <div className={ props.className }>
      <TreeNode
        source={ ls.current }
        isName={ node => node.name }
        isLeaf={ node => node.file }
        isChild={ node => node.children }
        path={ props.path }
        buttons={ [
          <EmbeddedButton
            key="view"
            label="view"
            title="view"
            on={ true }
            onClick={ handleClickView }
          />,
          <EmbeddedButton
            key="download"
            label="DL"
            title="download"
            on={ true }
            onClick={ handleClickDownload }
          />
        ] }
      />
    </div>
  )
}, (p, n) => {
  return p.path === n.path
})

FileExplorerBox.propTypes = {
  path      : PropTypes.string,   // re-rendering property
  className : PropTypes.string,
  onView    : PropTypes.func
}

FileExplorerBox.defaultProps = {
  path      : "",
  className : "",
  onView    : undefined
}

export default FileExplorerBox
