import React from "react"
import PropTypes from "prop-types"

const MainFrame = props => (
  <div className={ props.className }>
    <div>
      { props.head }
    </div>
    <div className="row overflow-hidden" style={ { height: props.height + "%" } }>
      <div className="col-3 h-100 overflow-auto">
        { props.left }
      </div>
      <div className="col-9 h-100 overflow-auto">
        { props.main }
      </div>
    </div>
  </div>
)

MainFrame.propTypes = {
  className : PropTypes.string,
  head      : PropTypes.element,
  left      : PropTypes.element,
  main      : PropTypes.element,
  height    : PropTypes.number
}

MainFrame.defaultProps = {
  className : "",
  head      : <></>,
  left      : <></>,
  main      : <></>,
  height    : 85
}

export default MainFrame
