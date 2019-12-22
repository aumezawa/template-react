import React from "react"
import PropTypes from "prop-types"

// For Table Test - Start
import axios from "axios"
// For Table Test - End

import FileUploaderModal from "../component/file-uploader-modal.js"
import Navigator from "../component/navigator.js"
import Table from "../component/table.js"

export default class MainPage extends React.Component {

  constructor(props) {
    super(props)
    this.data = {}
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

  // For Table Test - Start
  componentDidMount() {
    this.getFile()
  }

  getFile() {
    const uri = location.protocol + "//" + location.host + "/data/summary"
    axios.get(uri)
      .then((res) => {
        this.data = res.data
        this.setState({})
      })
      .catch((err) => {
      })
  }
  // For Table Test - End

  render() {
    return (
      <div>
        <Navigator title={ this.props.project } items={ () => this.navigatorItems() } />
        <div className="text-center">
          <p>Hello { this.props.user }! This is the main page.</p>
          <FileUploaderModal path="/data" />
          <Table inputData={ this.data } />
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
