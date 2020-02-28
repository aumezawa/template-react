import React from "react"
import PropTypes from "prop-types"

import CenterFrame from "../component/center-frame.js"
import DropdownHeader from "../component/dropdown-header.js"
import LayerFrame from "../component/layer-frame.js"
import NavigatorBar from "../component/navigator-bar.js"
import UserLoginBox from "../component/user-login-box.js"

const LoginPage = React.memo((props) => (
  <div className="container-fluid">
    <LayerFrame
      head={
        <NavigatorBar
          title={ props.project }
          items={ [ <DropdownHeader key="header" label={ `Version: ${ props.version }` } />] }
        />
      }
      body={ <CenterFrame body={ <UserLoginBox /> } /> }
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
