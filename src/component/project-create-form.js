import React, { useState, useRef, useCallback } from "react"
import PropTypes from "prop-types"

import ButtonSet from "./button-set.js"
import TextForm from "./text-form.js"

const ProjectCreateForm = React.memo(props => {
  const [validProject, setValidProject] = useState(false)

  const refs = useRef({
    project : React.createRef()
  })

  const data = useRef({
    project : ""
  })

  const handleChangeProject = useCallback(text => {
    data.current.project = text
    const valid = !!text.match(/^[0-9a-zA-Z_/]*$/)
    setValidProject(valid)
  }, [true])

  const handleSubmit = useCallback(() => {
    if (props.onSubmit) {
      props.onSubmit(data.current)
    }
  }, [props.onSubmit])

  const handleCancel = useCallback(() => {
    data.current.project = refs.current.project.current.value  = ""
    setValidProject(false)
    if (props.onCancel) {
      props.onCancel()
    }
  }, [props.onCancel])

  return (
    <div className={ props.className }>
      <TextForm
        ref={ refs.current.project }
        valid={ validProject }
        label={ props.projectLabel }
        disabled={ props.disabled }
        onChange={ handleChangeProject }
      />
      <ButtonSet
        submit={ props.submitLabel }
        cancel={ props.cancelLabel }
        disabled={ !validProject }
        onSubmit={ handleSubmit }
        onCancel={ handleCancel }
      />
    </div>
  )
})

ProjectCreateForm.propTypes = {
  className   : PropTypes.string,
  submitLabel : PropTypes.string,
  cancelLabel : PropTypes.string,
  projectLabel: PropTypes.string,
  disabled    : PropTypes.bool,
  onSubmit    : PropTypes.func,
  onCancel    : PropTypes.func
}

ProjectCreateForm.defaultProps = {
  className   : "",
  submitLabel : "Create",
  cancelLabel : "Cancel",
  projectLabel: "Project",
  disabled    : false,
  onSubmit    : undefined,
  onCancel    : undefined
}

export default ProjectCreateForm
