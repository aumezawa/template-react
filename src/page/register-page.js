import React from "react"
import PropTypes from "prop-types"

import RegisterBox from "../component/register-box.js"
import Navigator from "../component/navigator.js"

export default class RegisterPage extends React.Component {

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
        <Navigator title={ this.props.project } items={ () => this.navigatorItems() } />
        <RegisterBox />
      </div>
    )
  }

  navigatorItems() {
    var menu = []
    menu.push(<button key="main" type="button" className="dropdown-item" onClick={ () => location.href = "/" }>Back to Main</button>)
    menu.push(<button key="logout" type="button" className="dropdown-item" onClick={ () => location.href = "/auth/form/logout" }>Logout</button>)
    return menu
  }

}
