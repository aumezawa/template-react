import React from "react"
import PropTypes from "prop-types"

const CenterFrame = props => (
  <div className={ `${ props.className } h-100` }>
    <div className="row justify-content-center h-100">
      <div className={ `col-6 ${ props.bodyOverflow ? "overflow-auto" : "overflow-hidden" } h-100` }>
        { props.body }
      </div>
    </div>
  </div>
)

CenterFrame.propTypes = {
  className   : PropTypes.string,
  body        : PropTypes.element,
  bodyOverflow: PropTypes.bool
}

CenterFrame.defaultProps = {
  className   : "",
  body        : <></>,
  bodyOverflow: true
}

export default CenterFrame
