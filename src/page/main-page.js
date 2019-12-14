import React from "react"
import PropTypes from "prop-types"

import FileUploaderModal from "../component/file-uploader-modal.js"
import Navigator from "../component/navigator.js"

export default class MainPage extends React.Component {

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
        <div className="text-center">
          <p>Hello { this.props.user }! This is the main page.</p>
          <FileUploaderModal path="/data" />
        </div>
      </div>
    )
  }

  navigatorItems() {
    var menu = []
    menu.push(<button key="register" type="button" className="dropdown-item" disabled={ this.props.user !== "root" } onClick={ () => location.href = "/auth/form/register" }>Register User</button>)
    menu.push(<button key="logout" type="button" className="dropdown-item" onClick={ () => location.href = "/auth/form/logout" }>Logout</button>)
    return menu
  }

}
