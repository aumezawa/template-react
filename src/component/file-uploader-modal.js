import React, { useRef, useCallback } from "react"
import PropTypes from "prop-types"

import FileUploaderBox from "./file-uploader-box.js"
import Modal from "./modal.js"

const FileUploaderModal = React.memo(props => {
  const handleDone = useCallback(() => {
    if (props.onDone) {
      props.onDone()
    }
  }, [props.onDone])

  return (
    <Modal
      id={ props.id }
      title={ props.title }
      body={
        <FileUploaderBox
          path={ props.path }
          directory={ props.directory }
          onDone={ handleDone }
        />
      }
    />
  )
})

FileUploaderModal.propTypes = {
  id        : PropTypes.string.isRequired,
  path      : PropTypes.string.isRequired,
  title     : PropTypes.string,
  directory : PropTypes.bool,
  onDone    : PropTypes.func
}

FileUploaderModal.defaultProps = {
  id        : undefined,
  path      : undefined,
  title     : "File Uploader",
  directory : true,
  onDone    : undefined
}

export default FileUploaderModal
