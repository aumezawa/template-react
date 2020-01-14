import React from "react"
import PropTypes from "prop-types"

import CenterFrame from "../component/center-frame.js"
import UserLoginBox from "../component/user-login-box.js"
import NavigatorBar from "../component/navigator-bar.js"

const LoginPage = React.memo((props) => (
  <div className="container-fluid">
    <NavigatorBar title={ props.project } />
    <CenterFrame main={
      <UserLoginBox />
    } />
  </div>
), (p, n) => true)

LoginPage.propTypes = {
  project : PropTypes.string,
  user    : PropTypes.string
}

LoginPage.defaultProps = {
  project : "unaffiliated",
  user    : "anonymous"
}

export default LoginPage
