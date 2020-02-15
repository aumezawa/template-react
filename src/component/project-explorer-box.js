import React, { useState, useEffect, useRef, useCallback, useReducer } from "react"
import PropTypes from "prop-types"

import axios from "axios"

import DropdownButton from "./dropdown-button.js"
import DropdownItem from "./dropdown-item.js"
import FileUploaderModal from "./file-uploader-modal.js"
import ProjectCreaterModal from "./project-creater-modal.js"
import ToggleButton from "./toggle-button.js"
import TreeLeaf from "./file-tree-leaf.js"

import uniqueId from "../lib/uniqueId.js"

const ProjectExplorerBox = React.memo(props => {
  const [mode   , setMode]     = useState(true)
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0)

  const id = useRef({
    newpro: "modal-" + uniqueId(),
    upload: "modal-" + uniqueId()
  })
  const ls = useRef([])
  const dirPath = useRef("")

  const loadProject = useCallback(() => {
    if (props.path === "") {
      return
    }
    const uri = `${ location.protocol }//${ location.host }${ props.path }/${ mode ? "shared" : props.user }?cmd=ls`
    axios.get(uri)
    .then(res => {
      if (!res.data.success) {
        throw new Error("no directory found")
      }
      ls.current = res.data.ls
      forceUpdate()
    })
    .catch(err => {
      alert("Could not view this project...")
    })
  }, [props.path, props.user, mode])

  useEffect(loadProject, [props.path, props.user, mode])

  const handleClickMode = useCallback(value => {
    setMode(value)
  }, [true])

  const handleSelect = useCallback(data => {
    if (props.onSelect) {
      props.onSelect({
        path: data.parent
      })
    }
  }, [props.onSelect])

  const handleUpload = useCallback(data => {
    dirPath.current = data.parent
    forceUpdate()
  }, [true])

  const handleDelete = useCallback(data => {
    const uri = `${ location.protocol }//${ location.host }${ data.parent }?cmd=rm`
    axios.get(uri)
    .then(res => {
      if (!res.data.success) {
        throw new Error("")
      }
      loadProject()
      forceUpdate()
    })
    .catch(err => {
      alert("Could not delete the project...")
    })
  }, [props.path, props.user, mode])

  const renderList = () => {
    try {
      return ls.current.children.map(child => {
        const nodepath = props.path + "/" +  (mode ? "shared" : props.user) + "/" + child.name
        if (child.file) {
          return
        }
        return (
          <TreeLeaf
            key={ nodepath }
            path={ nodepath }
            label={ child.name }
            items={ [
              <DropdownItem
                key="open"
                label="open"
                onClick={ handleSelect }
              />,
              <DropdownItem
                key="upload"
                label="upload"
                toggle="modal"
                target={ id.current.upload }
                onClick={ handleUpload }
              />,
              <DropdownItem
                key="delete"
                label="delete"
                disabled={ props.user != "root" && props.user != "anonymous" }
                onClick={ handleDelete }
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
      <ProjectCreaterModal
        id={ id.current.newpro }
        path={ props.path + "/" +  (mode ? "shared" : props.user) }
        onDone={ loadProject }
      />
      <FileUploaderModal
        id={ id.current.upload }
        path={ dirPath.current }
        directory={ false }
        onDone={ undefined }
      />
      <div className="row my-3">
        <ToggleButton
          className="col"
          onLabel="shared"
          offLabel="local"
          defaultOn
          onClick={ handleClickMode }
        />
        <DropdownButton
          className="col-auto"
          items={ [
            <DropdownItem
              key="New Project"
              label="New Project"
              toggle="modal"
              target={ id.current.newpro }
            />
          ] }
        />
      </div>
      <ul className="list-group text-left text-monospace">
        { renderList() }
      </ul>
    </div>
  )
})

ProjectExplorerBox.propTypes = {
  className : PropTypes.string,
  path      : PropTypes.string,
  user      : PropTypes.string,
  onSelect  : PropTypes.func
}

ProjectExplorerBox.defaultProps = {
  className : "",
  path      : undefined,
  user      : "anonymous",
  onSelect  : undefined
}

export default ProjectExplorerBox
