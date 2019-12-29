import React from "react"
import PropTypes from "prop-types"

import LoginBox from "../component/login-box.js"
import NavigatorBar from "../component/navigator-bar.js"
import NavigatorItem from "../component/navigator-item.js"

export default class LoginPage extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {}
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
        <NavigatorBar title={ this.props.project } />
        <LoginBox />
      </div>
    )
  }

}
