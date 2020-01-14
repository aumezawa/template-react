import React from "react"
import PropTypes from "prop-types"

const CenterFrame = props => (
  <div className={ props.className }>
    <div className="row justify-content-center">
      <div className="col-6 h-100 overflow-auto">
        { props.main }
      </div>
    </div>
  </div>
)

CenterFrame.propTypes = {
  className : PropTypes.string,
  content   : PropTypes.element
}

CenterFrame.defaultProps = {
  className : "",
  content   : <></>
}

export default CenterFrame
