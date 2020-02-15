import React, { useState, useRef, useCallback } from "react"
import PropTypes from "prop-types"

import ButtonSet from "./button-set.js"
import FileForm from "./file-form.js"
import TextForm from "./text-form.js"

const FileUploadForm = React.memo(props => {
  const [validDir , setValidDir]  = useState(true)
  const [validFile, setValidFile] = useState(false)

  const refs = useRef({
    dir : React.createRef(),
    file: React.createRef()
  })

  const data = useRef({
    directory : "",
    filename  : "",
    fileobj   : undefined
  })

  const handleChangeDir = useCallback(text => {
    data.current.directory = text
    const valid = !!text.match(/^[0-9a-zA-Z_/]*$/)
    setValidDir(valid)
  }, [true])

  const handleChangeFile = useCallback(file => {
    data.current.filename = file.name
    data.current.fileobj  = file.obj
    file.name !== "" ? setValidFile(true) : setValidFile(false)
  }, [true])

  const handleSubmit = useCallback(() => {
    if (props.onSubmit) {
      props.onSubmit(data.current)
    }
  }, [props.onSubmit])

  const handleCancel = useCallback(() => {
    data.current.directory  = refs.current.dir.current.value  = ""
    data.current.filename   = refs.current.file.current.value = ""
    data.current.fileobj    = undefined
    setValidFile(false)
    if (props.onCancel) {
      props.onCancel()
    }
  }, [props.onCancel])

  return (
    <div className={ props.className }>
      <TextForm
        ref={ refs.current.dir }
        valid={ validDir }
        label={ props.dirLabel }
        disabled={ props.disabled }
        hidden={ !props.directory }
        onChange={ handleChangeDir }
      />
      <FileForm
        ref={ refs.current.file }
        valid={ validFile }
        filename={ data.current.filename }
        disabled={ props.disabled }
        onChange={ handleChangeFile }
      />
      <ButtonSet
        submit={ props.submitLabel }
        cancel={ props.cancelLabel }
        disabled={ !validFile || !validDir }
        onSubmit={ handleSubmit }
        onCancel={ handleCancel }
      />
    </div>
  )
})

FileUploadForm.propTypes = {
  className   : PropTypes.string,
  submitLabel : PropTypes.string,
  cancelLabel : PropTypes.string,
  dirLabel    : PropTypes.string,
  disabled    : PropTypes.bool,
  directory   : PropTypes.bool,
  onSubmit    : PropTypes.func,
  onCancel    : PropTypes.func
}

FileUploadForm.defaultProps = {
  className   : "",
  submitLabel : "Upload",
  cancelLabel : "Cancel",
  dirLabel    : "Directory",
  disabled    : false,
  directory   : true,
  onSubmit    : undefined,
  onCancel    : undefined
}

export default FileUploadForm
