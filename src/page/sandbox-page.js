import React from "react"
import PropTypes from "prop-types"

import NavigatorBar from "../component/navigator-bar.js"

const SandboxPage = React.memo(props => {
  return (
    <div className="container-fluid">
      <NavigatorBar title={ props.project } />
    </div>
  )
})

SandboxPage.propTypes = {
  project : PropTypes.string,
  user    : PropTypes.string
}

SandboxPage.defaultProps = {
  project : "unaffiliated",
  user    : "anonymous"
}

export default SandboxPage
