import React, { useState } from "react"
import PropTypes from "prop-types"

const ProgressBar = props => {
  const animation = (props.progress !== 100) ? "progress-bar-animated" : ""

  return (
    <div className={ props.className }>
      <div className="progress">
        <div
          className={ `progress-bar progress-bar-striped ${ animation }` }
          role="progressbar"
          aria-valuenow={ props.progress }
          aria-valuemin="0"
          aria-valuemax="100"
          style={ { width: props.progress + "%" } }
        >
        </div>
      </div>
    </div>
  )
}

ProgressBar.propTypes = {
  className : PropTypes.string,
  progress  : PropTypes.number
}

ProgressBar.defaultProps = {
  className : "mb-3",
  progress  : 0
}

export default ProgressBar
