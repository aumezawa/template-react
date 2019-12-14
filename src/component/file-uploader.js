import React from "react"
import PropTypes from "prop-types"

import axios from "axios"
import path from "path"

import sleep from "../lib/sleep.js"

export default class FileUploader extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selected  : false,
      uploading : false,
      progress  : 0
    }
  }

  static get propTypes() {
    return ({
      path          : PropTypes.string.isRequired,
      label         : PropTypes.string,
      indicator     : PropTypes.string,
      indicatorFunc : PropTypes.func,
      preFunc       : PropTypes.func,
      postFunc      : PropTypes.func,
      interval      : PropTypes.number
    })
  }

  static get defaultProps() {
    return ({
      path          : undefined,
      label         : "Upload",
      indicator     : "alert",
      indicatorFunc : undefined,
      preFunc       : undefined,
      postFunc      : undefined,
      interval      : 1
    })
  }

  render() {
    var display = ""
    if (this.state.uploading) {
      display = "Uploading " + this.filename + " ..."
    } else if (this.state.selected) {
      display = this.filename
    } else {
      display = "Choose file..."
    }

    return (
      <div>
        <form ref={ form => { this.form = form } }>
          <div className="input-group">
            <div className="custom-file">
              <input type="file" className="custom-file-input" id="customFile" disabled={ this.state.uploading } onChange={ e => this.fileSelected(e) } />
              <label className="custom-file-label" htmlFor="customFile">{ display }</label>
            </div>
            <div className="input-group-append">
              <button type="button" className="btn btn-primary"
                disabled={ !this.state.selected || this.state.uploading }
                onClick={ e => this.fileUpload() }>
                  { this.props.label }
              </button>
            </div>
          </div>
        </form>
        <div className="progress">
          <div className="progress-bar" role="progressbar"
            style={ { width: this.state.progress + "%" } }
            aria-valuenow={ this.state.progress }
            aria-valuemin="0" aria-valuemax="100">
              { (this.state.progress === 0) ? "" : this.state.progress + "%" }
          </div>
        </div>
      </div>
    )
  }

  fileSelected(event) {
    // replace separators to correctly extract basename on windows path
    this.filename = path.basename(event.target.value.replace(/\\/g, "/"))
    if (this.filename === "") {
      this.resetForm()
    } else {
      this.file = event.target.files[0]
      this.setState({
        selected  : true,
        uploading : false,
        progress  : 0
      })
    }
  }

  fileUpload() {
    var uri = location.protocol + "//" + location.host + this.props.path
    var params = new FormData()
    params.append("file", this.file)

    this.setState({
      selected  : true,
      uploading : true,
      progress  : 0
    })

    if (this.props.preFunc) {
      this.props.preFunc()
    }

    axios.post(uri, params, {
      onUploadProgress: (progressEvent) => {
        this.setState({
          selected  : true,
          uploading : true,
          progress  : parseInt(progressEvent.loaded / progressEvent.total * 100)
        })
      }
    })
      .then((res) => {
        this.success = true
        return sleep(1, res)
      })
      .catch((err) => {
        this.success = false
        return sleep(1, err)
      })
      .then((res) => {
        this.resultIndicator(this.success)
        return sleep(this.props.interval, res)
      })
      .then((res) => {
        this.resetForm()
        if (this.props.postFunc) {
          this.props.postFunc()
        }
      })
  }

  resetForm() {
    this.filename = ""
    this.file = undefined
    this.form.reset()
    this.setState({
      selected  : false,
      uploading : false,
      progress  : 0
    })
  }

  resultIndicator(success) {
    var message = this.filename + ((success) ? " was uploaded successfully." : " could not be uploaded...")
    switch (this.props.indicator) {
      case "alert":
        alert(message)
        break
      case "parent":
        if (this.props.indicatorFunc) {
          this.props.indicatorFunc(message)
        } else {
          alert(message)
        }
        break
      default:
        break
    }
  }

}
