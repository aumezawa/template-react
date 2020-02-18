import React from "react"
import PropTypes from "prop-types"

const LayerFrame = props => {
  const overflow = props.bodyOverflow ? "flex-basis-0 overflow-auto" : "overflow-hidden"

  return (
    <div className={ `${ props.className } d-flex flex-column overflow-hidden h-100` }>
      <div>
        { props.head }
      </div>
      <div className={ `flex-grow-1 ${ overflow }` }>
        <div className="d-block h-100">
          { props.body }
        </div>
      </div>
      <div>
        { props.foot }
      </div>
    </div>
  )
}

LayerFrame.propTypes = {
  className   : PropTypes.string,
  head        : PropTypes.element,
  body        : PropTypes.element,
  foot        : PropTypes.element,
  bodyOverflow: PropTypes.bool
}

LayerFrame.defaultProps = {
  className   : "",
  head        : <></>,
  body        : <></>,
  foot        : <></>,
  bodyOverflow: true
}

export default LayerFrame
