import React, { useState, useRef, useEffect, useCallback, useReducer } from "react"
import PropTypes from "prop-types"

import axios from "axios"

import MessageCard from "./message-card.js"
import ProjectCreateForm from "./project-create-form.js"

const ProjectCreaterBox = React.memo(props => {
  const [done,      setDone]      = useState(false)
  const [success,   setSuccess]   = useState(false)

  const [formId,    clearForm]    = useReducer(x => x + 1, 0)

  useEffect(() => {
    message.current = "Please input a new project name."
    setDone(false)
    clearForm()
  }, [props.path])

  const message = useRef("")
  const color   = done ? (success ? "success" : "failure") : "normal"

  const handleSubmit = useCallback(data => {
    const uri = props.path + "/" + data.project + "?cmd=mkdir"

    setDone(false)
    axios.get(uri)
    .then(res => {
      if (!res.data.success) {
        throw new Error("making project failed")
      }
      message.current = `${ data.project } was created successfully.`
      setDone(true)
      setSuccess(true)
      if (props.onDone) {
        props.onDone()
      }
      clearForm()
    })
    .catch(err => {
      message.current = `${ data.project } could not be created...`
      setDone(true)
      setSuccess(false)
      clearForm()
    })
  }, [props.path, props.onDone])

  return (
    <div className={ props.className }>
      <MessageCard
        className="mt-0 mb-3"
        message={ message.current }
        type={ color }
      />
      <ProjectCreateForm
        key={ formId }
        onSubmit={ handleSubmit }
      />
    </div>
  )
})

ProjectCreaterBox.propTypes = {
  className : PropTypes.string,
  path      : PropTypes.string.isRequired,
  onDone    : PropTypes.func
}

ProjectCreaterBox.defaultProps = {
  className : "",
  path      : undefined,
  onDone    : undefined
}

export default ProjectCreaterBox
