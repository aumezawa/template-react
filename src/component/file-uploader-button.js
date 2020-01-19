import React, { useRef, useCallback } from "react"
import PropTypes from "prop-types"

import FileUploaderBox from "./file-uploader-box.js"
import Modal from "./modal.js"

import uniqueId from "../lib/uniqueId.js"

const FileUploaderButton = React.memo(props => {
  const id = useRef({
    modal: "modal-" + uniqueId()
  })

  const handleDone = useCallback(() => {
    if (props.onDone) {
      props.onDone()
    }
  }, [props.onDone])

  return (
    <div className="my-3">
      <div className="form-row justify-content-center">
        <div className="col-auto">
          <Modal
            id={ id.current.modal }
            title={ props.label }
            body={
              <FileUploaderBox path={ props.path } onDone={ handleDone } />
            }
          />
          <button
            className="btn btn-primary"
            type="button"
            data-toggle="modal"
            data-target={ "#" + id.current.modal }
          >
            Launch { props.label }
          </button>
        </div>
      </div>
    </div>
  )
})

FileUploaderButton.propTypes = {
  path      : PropTypes.string.isRequired,
  className : PropTypes.string,
  label     : PropTypes.string,
  onDone    : PropTypes.func
}

FileUploaderButton.defaultProps = {
  path      : undefined,
  className : "",
  label     : "File Uploader",
  onDone    : undefined
}

export default FileUploaderButton
