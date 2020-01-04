import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import axios from "axios"
import path from "path"

import uniqueId from "../lib/uniqueId.js"

import FileUploader from "./file-uploader.js"
import Modal from "./modal.js"

export default class FileUploaderButton extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      uploaded: false
    }
    this.id = {
      modal   : "modal-" + uniqueId()
    }
    this.data = {
      open    : false,
      message : FileUploaderButton.message(this.props.label)
    }
  }

  static get propTypes() {
    return ({
      path      : PropTypes.string.isRequired,
      title     : PropTypes.string,
      center    : PropTypes.bool,
      margin    : PropTypes.bool,
      preFunc   : PropTypes.func,
      postFunc  : PropTypes.func,
      interval  : PropTypes.number
    })
  }

  static get defaultProps() {
    return ({
      path      : undefined,
      title     : "File Uploader",
      center    : false,
      margin    : false,
      preFunc   : undefined,
      postFunc  : undefined,
      interval  : 3
    })
  }

  static message(label) {
    return "Choose an upload file, then press [" + label + "] button."
  }

  render() {
    return (
      <div className={ ClassNames({ "text-center": this.props.center, "my-3": this.props.margin }) }>
        <button
          type="button"
          className="btn btn-primary"
          data-toggle="modal"
          data-target={ "#" + this.id.modal }
          onClick={ () => this.handleClickOpen() }
        >
          Launch {this.props.title}
        </button>
        <Modal
          id={ this.id.modal }
          title={ this.props.title }
          message={ this.data.message }
          body={
            <FileUploader
              path={ this.props.path }
              onDone={ (success, data) => this.onDone(success, data) }
              preFunc={ () => this.preFunc() }
              postFunc={ () => this.postFunc() }
              interval={ this.props.interval }
            />
          }
          closeFunc={ () => this.handleClickClose() }
        />
      </div>
    )
  }

  handleClickOpen() {
    this.data.open = true
  }

  handleClickClose() {
    this.data.open = false
  }

  onDone(success, data) {
    this.data.message = data.message
    this.setState({
      uploaded: true
    })

    if (!this.data.open) {
      alert(this.data.message)
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

    this.data.message = FileUploaderButton.message(this.props.label)
    this.setState({
      uploaded: false
    })
  }

}
