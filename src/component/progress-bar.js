import React, {useState} from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

const ProgressBar = props => (
  <div className={ props.className }>
    <div className="progress">
      <div
        className={ ClassNames({"progress-bar": true, "progress-bar-striped": true, "progress-bar-animated": props.progress !== 100 }) }
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

ProgressBar.propTypes = {
  className : PropTypes.string,
  progress  : PropTypes.number
}

ProgressBar.defaultProps = {
  className : "mb-3",
  progress  : 0
}

export default ProgressBar
