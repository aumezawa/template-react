import React, { useRef, useCallback } from "react"
import PropTypes from "prop-types"

import CommentForm from "./comment-form.js"
import CommentViewer from "./comment-viewer.js"
import Modal from "./modal.js"

const CommentEditorModal = React.memo(props => {
  const handleSubmit = useCallback(data => {
    if (props.onSubmit) {
      props.onSubmit(data)
    }
  }, [props.onSubmit])

  return (
    <Modal
      id={ props.id }
      title={ props.title }
      size="modal-xl"
      message={ props.message }
      body={ <CommentViewer user={ props.user } comments={ props.comments } /> }
      footer={ <CommentForm className="w-100" key={ props.formId } cancel="Close" dismiss="modal" onSubmit={ handleSubmit } /> }
    />
  )
})

CommentEditorModal.propTypes = {
  id      : PropTypes.string.isRequired,
  formId  : PropTypes.number,
  title   : PropTypes.string,
  message : PropTypes.string,
  user    : PropTypes.string,
  comments: PropTypes.array,
  onSubmit: PropTypes.func
}

CommentEditorModal.defaultProps = {
  id      : undefined,
  formId  : 0,
  title   : "",
  message : "",
  user    : "anonymous",
  comments: [],
  onSubmit: undefined
}

export default CommentEditorModal
