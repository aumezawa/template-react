import React, {useRef} from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import FileUploaderBox from "./file-uploader-box.js"
import Modal from "./modal.js"

import uniqueId from "../lib/uniqueId.js"

const FileUploaderButton = React.memo(props => {
  const id = useRef({
    modal: "modal-" + uniqueId()
  })

  return (
    <div className="my-3">
      <div className="form-row justify-content-center">
        <div className="col-auto">
          <Modal
            id={ id.current.modal }
            title={ props.label }
            body={
              <FileUploaderBox path={ props.path } />
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
}, (p, n) => true)

FileUploaderButton.propTypes = {
  path      : PropTypes.string.isRequired,
  className : PropTypes.string,
  label     : PropTypes.string
}

FileUploaderButton.defaultProps = {
  path      : undefined,
  className : "",
  label     : "File Uploader"
}

export default FileUploaderButton
