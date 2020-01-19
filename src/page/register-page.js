import React from "react"
import PropTypes from "prop-types"

import CenterFrame from "../component/center-frame.js"
import UserRegisterBox from "../component/user-register-box.js"
import NavigatorBar from "../component/navigator-bar.js"
import NavigatorItem from "../component/navigator-item.js"

const LoginPage = React.memo((props) => (
  <div className="container-fluid">
    <NavigatorBar
      title={ props.project }
      items={ [
        <NavigatorItem key="main" />,
        <NavigatorItem key="logout" label="Logout" page="/auth/form/logout" />
      ] }
    />
    <CenterFrame main={
      <UserRegisterBox />
    } />
  </div>
))

LoginPage.propTypes = {
  project : PropTypes.string,
  user    : PropTypes.string
}

LoginPage.defaultProps = {
  project : "unaffiliated",
  user    : "anonymous"
}

export default LoginPage
