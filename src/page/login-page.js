import React from "react"
import PropTypes from "prop-types"

import LoginBox from "../component/login-box.js"
import Navigator from "../component/navigator.js"

export default class LoginPage extends React.Component {

  constructor(props) {
    super(props)
  }

  static get propTypes() {
    return ({
      project : PropTypes.string,
      user    : PropTypes.string
    })
  }

  static get defaultProps() {
    return ({
      project : "unaffiliated",
      user    : "anonymous"
    })
  }

  render() {
    return (
      <div>
        <Navigator title={ this.props.project } />
        <LoginBox />
      </div>
    )
  }

}
