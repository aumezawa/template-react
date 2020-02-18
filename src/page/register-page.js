import React from "react"
import PropTypes from "prop-types"

import CenterFrame from "../component/center-frame.js"
import LayerFrame from "../component/layer-frame.js"
import NavigatorBar from "../component/navigator-bar.js"
import NavigatorItem from "../component/navigator-item.js"
import UserRegisterBox from "../component/user-register-box.js"

const LoginPage = React.memo((props) => (
  <div className="container-fluid">
    <LayerFrame
      head={
        <NavigatorBar
          title={ props.project }
          items={ [
            <NavigatorItem key="main" />,
            <NavigatorItem key="logout" label="Logout" page="/auth/form/logout" />
          ] }
        />
      }
      body={ <CenterFrame body={ <UserRegisterBox /> } /> }
      foot={ <div className="text-light text-right bg-dark mt-2 py-1 px-2">Coded by { props.author }, powered by React</div> }
      bodyOverflow={ false }
    />
  </div>
))

LoginPage.propTypes = {
  project : PropTypes.string,
  author  : PropTypes.string,
  user    : PropTypes.string
}

LoginPage.defaultProps = {
  project : "unaffiliated",
  author  : "unnamed",
  user    : "anonymous"
}

export default LoginPage
