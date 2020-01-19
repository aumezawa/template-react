import React, { useState, useRef, useCallback } from "react"
import PropTypes from "prop-types"

import ButtonSet from "./button-set.js"
import FileForm from "./file-form.js"
import TextForm from "./text-form.js"

const FileUploadForm = React.memo(props => {
  const [validText, setValidText] = useState(true)
  const [validFile, setValidFile] = useState(false)

  const refs = useRef({
    text: React.createRef(),
    file: React.createRef()
  })

  const data = useRef({
    directory : "",
    filename  : "",
    fileobj   : undefined
  })

  const handleChangeText = useCallback(text => {
    data.current.directory = text
    const valid = !!text.match(/^[0-9a-zA-Z_/]*$/)
    setValidText(valid)
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
    data.current.directory  = refs.current.text.current.value = ""
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
        ref={ refs.current.text }
        valid={ validText }
        label="Directory"
        disabled={ props.disabled }
        onChange={ handleChangeText }
      />
      <FileForm
        ref={ refs.current.file }
        valid={ validFile }
        filename={ data.current.filename }
        disabled={ props.disabled }
        onChange={ handleChangeFile }
      />
      <ButtonSet
        submit="Upload"
        cancel="Cancel"
        disabled={ !validFile }
        onSubmit={ handleSubmit }
        onCancel={ handleCancel }
      />
    </div>
  )
})

FileUploadForm.propTypes = {
  className : PropTypes.string,
  disabled  : PropTypes.bool,
  onSubmit  : PropTypes.func,
  onCancel  : PropTypes.func
}

FileUploadForm.defaultProps = {
  className : "",
  disabled  : false,
  onSubmit  : undefined,
  onCancel  : undefined
}

export default FileUploadForm
