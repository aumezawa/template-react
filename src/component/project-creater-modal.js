import React, { useRef, useCallback } from "react"
import PropTypes from "prop-types"

import ProjectCreaterBox from "./project-creater-box.js"
import Modal from "./modal.js"

const ProjectCreaterModal = React.memo(props => {
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
        <ProjectCreaterBox
          path={ props.path }
          onDone={ handleDone }
        />
      }
    />
  )
})

ProjectCreaterModal.propTypes = {
  id        : PropTypes.string.isRequired,
  path      : PropTypes.string.isRequired,
  title     : PropTypes.string,
  onDone    : PropTypes.func
}

ProjectCreaterModal.defaultProps = {
  id        : undefined,
  path      : undefined,
  title     : "Create a new project",
  onDone    : undefined
}

export default ProjectCreaterModal
