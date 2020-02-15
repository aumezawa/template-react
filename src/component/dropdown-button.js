import React, { useRef } from "react"
import PropTypes from "prop-types"

import uniqueId from "../lib/uniqueId.js"

const DropdownButton = props => {
  const shape = props.square ? "rounded-0 h-100" : ""

  const id = useRef({
    drop: uniqueId()
  })

  return (
    <div className={ `${ props.className } dropdown` }>
      <button
        className={ `btn btn-secondary dropdown-toggle ${ shape }` }
        type="button"
        id={ id.current.drop }
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        { props.label }
      </button>
      <div
        className="dropdown-menu"
        aria-labelledby={ id.current.drop }
        title={ props.title }
      >
        { props.items }
      </div>
    </div>
  )
}

DropdownButton.propTypes = {
  className : PropTypes.string,
  label     : PropTypes.string,
  title     : PropTypes.string,
  square    : PropTypes.bool,
  items     : PropTypes.array
}

DropdownButton.defaultProps = {
  className : "",
  label     : "",
  title     : "",
  square    : true,
  items     : []
}

export default DropdownButton
