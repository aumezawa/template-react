import React from "react"
import PropTypes from "prop-types"

import axios from "axios"
import path from "path"

import FileUploader from "./file-uploader.js"

export default class FileUploaderModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open      : false,
      uploaded  : false
    }
    this.message = "Choose an upload file, then press [" + this.props.label + "] button."
  }

  static get propTypes() {
    return ({
      path      : PropTypes.string.isRequired,
      name      : PropTypes.string,
      label     : PropTypes.string,
      preFunc   : PropTypes.func,
      postFunc  : PropTypes.func,
      interval  : PropTypes.number
    })
  }

  static get defaultProps() {
    return ({
      path      : undefined,
      name      : "File Uploader",
      label     : "Upload",
      preFunc   : undefined,
      postFunc  : undefined,
      interval  : 3
    })
  }

  render() {
    return (
      <div>
        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal-upload" onClick={ () => this.opened() }>
          Launch {this.props.name}
        </button>

        <div className="modal fade" id="modal-upload" tabIndex="-1" role="dialog" aria-labelledby="modal-label" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modal-label">{ this.props.name }</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={ () => this.hidden() }>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="text-left">{ this.message }</div>
                <br />
                <FileUploader path={ this.props.path } label={ this.props.label }
                  indicator="parent" indicatorFunc={ message => this.fileUploaded(message) }
                  preFunc={ () => this.preFunc() } postFunc={ () => this.postFunc() } interval={ this.props.interval } />
                </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={ () => this.hidden() }>Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  opened() {
    this.setState({
      open: true
    })
  }

  hidden() {
    this.setState({
      open: false
    })
  }

  fileUploaded(message) {
    this.message = message
    this.setState({
      uploaded: true
    })
    if (!this.state.open) {
      alert(message)
    }
  }

  preFunc() {
    if (this.props.preFunc) {
      this.props.preFunc()
    }
  }

  postFunc() {
    this.message = "Choose an upload file, then press [" + this.props.label + "] button."
    this.setState({
      uploaded: false
    })
    if (this.props.postFunc) {
      this.props.postFunc()
    }
  }

}
