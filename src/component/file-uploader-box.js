import React, { useState, useRef, useEffect, useCallback, useReducer } from "react"
import PropTypes from "prop-types"

import axios from "axios"

import FileUploadForm from "./file-upload-form.js"
import MessageCard from "./message-card.js"
import ProgressBar from "./progress-bar.js"

import sleep from "../lib/sleep.js"

const FileUploaderBox = React.memo(props => {
  const [done,      setDone]      = useState(false)
  const [success,   setSuccess]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress,  setProgress]  = useState(0)

  const [formId,    clearForm]    = useReducer(x => x + 1, 0)

  useEffect(() => {
    message.current = (props.directory) ? "Please choose a upload file and input a store directory." : "Please choose a upload file."
    setDone(false)
    clearForm()
  }, [props.path])

  const message = useRef("")
  const color   = done ? (success ? "success" : "failure") : "normal"

  const handleSubmit = useCallback(data => {
    const uri = props.path + "/" + data.directory
    const params = new FormData()
    params.append("file", data.fileobj)

    setDone(false)
    setUploading(true)
    setProgress(0)
    axios.get(uri + "?cmd=mkdir")
    .then(res => {
      if (!res.data.success) {
        throw new Error("making directory failed")
      }
      return axios.post(uri, params, {
        onUploadProgress: progressEvent => setProgress(parseInt(progressEvent.loaded / progressEvent.total * 100))
      })
    })
    .then(res => {
      message.current = `${ data.filename } was uploaded successfully.`
      setDone(true)
      setSuccess(true)
      if (props.onDone) {
        props.onDone()
      }
    })
    .catch(err => {
      message.current = `${ data.filename } could not be uploaded...`
      setDone(true)
      setSuccess(false)
    })
    .then(() => {
      sleep(props.interval)
    })
    .then(() => {
      clearForm()
      setUploading(false)
      setProgress(0)
    })
  }, [props.path, props.interval, props.onDone])

  return (
    <div className={ props.className }>
      <MessageCard
        className="my-0"
        message={ message.current }
        type={ color }
      />
      <ProgressBar progress={ progress } />
      <FileUploadForm
        key={ formId }
        disabled={ uploading }
        directory={ props.directory }
        onSubmit={ handleSubmit }
      />
    </div>
  )
})

FileUploaderBox.propTypes = {
  className : PropTypes.string,
  path      : PropTypes.string.isRequired,
  directory : PropTypes.bool,
  interval  : PropTypes.number,
  onDone    : PropTypes.func
}

FileUploaderBox.defaultProps = {
  className : "",
  path      : undefined,
  directory : true,
  interval  : 3,
  onDone    : undefined
}

export default FileUploaderBox
