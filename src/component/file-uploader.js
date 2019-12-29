import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import axios from "axios"
import path from "path"

import sleep from "../lib/sleep.js"

import FileForm from "./file-form.js"

export default class FileUploader extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      uploading : false,
      progress  : 0
    }
    this.data = {}
    this.form = {}
  }

  static get propTypes() {
    return ({
      path    : PropTypes.string.isRequired,
      label   : PropTypes.string,
      onDone  : PropTypes.func,
      preFunc : PropTypes.func,
      postFunc: PropTypes.func,
      interval: PropTypes.number
    })
  }

  static get defaultProps() {
    return ({
      path    : undefined,
      label   : "Upload",
      onDone  : undefined,
      preFunc : undefined,
      postFunc: undefined,
      interval: 1
    })
  }

  render() {
    return (
      <div>
        <FileForm
          ref={ ref => this.form.file = ref }
          label={ this.props.label }
          submit={ true }
          disabled={ this.state.uploading }
          onSubmit={ data => this.handleSubmit(data) }
        />
        <div className="progress">
          <div
            className={ ClassNames({"progress-bar": true, "progress-bar-striped": true, "progress-bar-animated": !(this.state.progress === 100) }) }
            role="progressbar"
            aria-valuenow={ this.state.progress }
            aria-valuemin="0"
            aria-valuemax="100"
            style={ { width: this.state.progress + "%" } }
          >
          </div>
        </div>
      </div>
    )
  }

  handleSubmit(data) {
    let success = true
    let uri = location.protocol + "//" + location.host + this.props.path
    let params = new FormData()
    params.append("file", data.file)

    this.setState({
      uploading : true,
      progress  : 0
    })

    this.preFunc()

    axios.post(uri, params, {
      onUploadProgress: (progressEvent) => {
        this.setState({
          progress  : parseInt(progressEvent.loaded / progressEvent.total * 100)
        })
      }
    })
    .catch(err => {
      success = false
    })
    .then(() => {
      this.onDone(success, data)
      return sleep(this.props.interval)
    })
    .then(() => {
      this.postFunc()
      this.form.file.reset()
      this.setState({
        uploading : false,
        progress  : 0
      })
    })
  }

  onDone(success, data) {
    data.message = data.filename + (success ? " was uploaded successfully." : " could not be uploaded...")
    if (this.props.onDone) {
      this.props.onDone(success, data)
    } else {
      alert(data.message)
    }
  }

  preFunc() {
    if (this.props.preFunc) {
      this.props.preFunc()
    }
  }

  postFunc() {
    if (this.props.postFunc) {
      this.props.postFunc()
    }
  }

}
