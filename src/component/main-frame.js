import React from "react"
import PropTypes from "prop-types"

const MainFrame = props => (
  <div className={ `${ props.className } d-flex flex-column overflow-hidden h-100` }>
    <div>
      { props.head }
    </div>
    <div className="flex-grow-1 overflow-hidden">
      <div className="d-block h-100">
        <div className="row h-100">
          <div className="col-3 h-100">
            <div className={ `${ props.leftOverflow ? "overflow-auto" : "overflow-hidden" } h-100` }>
              { props.left }
            </div>
          </div>
          <div className="col-9 h-100">
            <div className={ `${ props.bodyOverflow ? "overflow-auto" : "overflow-hidden" } h-100` }>
              { props.body }
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

MainFrame.propTypes = {
  className   : PropTypes.string,
  head        : PropTypes.element,
  left        : PropTypes.element,
  body        : PropTypes.element,
  leftOverflow: PropTypes.bool,
  bodyOverflow: PropTypes.bool
}

MainFrame.defaultProps = {
  className   : "",
  head        : <></>,
  left        : <></>,
  body        : <></>,
  leftOverflow: true,
  bodyOverflow: true
}

export default MainFrame
