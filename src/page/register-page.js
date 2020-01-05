import React from "react"
import PropTypes from "prop-types"

import RegisterBox from "../component/register-box.js"
import NavigatorBar from "../component/navigator-bar.js"
import NavigatorItem from "../component/navigator-item.js"

export default class RegisterPage extends React.PureComponent {

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
      <div className="container-fluid">
        <NavigatorBar
          title={ this.props.project }
          items={ [
            <NavigatorItem
              key="main"
            />,
            <NavigatorItem
              key="logout"
              label="Logout"
              page="/auth/form/logout"
            />
          ] }
          />
        <RegisterBox />
      </div>
    )
  }

}
