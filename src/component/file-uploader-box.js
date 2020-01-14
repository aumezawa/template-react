import React, {useState, useRef} from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import axios from "axios"
import path from "path"

import FileUploadForm from "./file-upload-form.js"
import MessageCard from "./message-card.js"
import ProgressBar from "./progress-bar.js"

import sleep from "../lib/sleep.js"
import uniqueId from "../lib/uniqueId.js"

const FileUploaderBox = React.memo(props => {
  const [done,      setDone]      = useState(false)
  const [success,   setSuccess]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress,  setProgress]  = useState(0)

  const id = useRef({
    form: uniqueId()
  })

  const message = useRef(`Please choose a upload file and input a store directory.`)

  const handleSubmit = data => {
    let uri = path.join(props.path, data.directory) + "?cmd=mkdir"
    let params = new FormData()
    params.append("file", data.fileobj)

    setDone(false)
    setUploading(true)
    setProgress(0)
    axios.get(uri)
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
    })
    .catch(err => {
      message.current = `${ data.filename } could not be uploaded...`
      setDone(true)
      setSuccess(false)
    })
    .then(() => {
      return sleep(props.interval)
    })
    .then(() => {
      id.current.form = uniqueId() // to reset form
      setUploading(false)
      setProgress(0)
    })
  }

  return (
    <div className={ props.className }>
      <MessageCard
        className="my-0"
        message={ message.current }
        type={ done ? (success ? "success" : "failure") : "normal" }
      />
      <ProgressBar progress={ progress } />
      <FileUploadForm
        key={ id.current.form }
        disabled={ uploading }
        onSubmit={ handleSubmit }
      />
    </div>
  )
}, (p, n) => true)

FileUploaderBox.propTypes = {
  path      : PropTypes.string.isRequired,
  className : PropTypes.string,
  interval  : PropTypes.number
}

FileUploaderBox.defaultProps = {
  path      : undefined,
  className : "",
  interval  : 3
}

export default FileUploaderBox
