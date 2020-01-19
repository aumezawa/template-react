import React, { useRef } from "react"
import PropTypes from "prop-types"

import uniqueId from "../lib/uniqueId.js"

const NavigatorBar = React.memo(props => {
  const id = useRef({
    menu: "dropdownMenu-" + uniqueId()
  })

  return (
    <nav className="navbar navbar-dark bg-dark">
      <p className="navbar-brand">{ props.title }</p>
      <div className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          id={ id.current.menu }
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Menu
        </button>
        <div
          className="dropdown-menu dropdown-menu-right"
          aria-labelledby={ id.current.menu }
          style={ { "zIndex": 9999 } }
        >
          { props.items }
        </div>
      </div>
    </nav>
  )
})

NavigatorBar.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array
}

NavigatorBar.defaultProps = {
  title: "Navigation Bar",
  items: [<h6 className="dropdown-header" key="nothing">Nothing</h6>]
}

export default NavigatorBar
