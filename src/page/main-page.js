import React from "react"
import PropTypes from "prop-types"

// For Table Test - Start
import axios from "axios"
// For Table Test - End

import FileExplorerBox from "../component/file-explorer-box.js"
import FileUploaderButton from "../component/file-uploader-button.js"
import FiltableTable from "../component/filtable-table.js"
import NavigatorBar from "../component/navigator-bar.js"
import NavigatorItem from "../component/navigator-item.js"

export default class MainPage extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      // For Test - Start
      toggle: false
      // For Test - End
    }
    this.data = {}
    this.source = undefined
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

  // For Test - Start
  componentDidMount() {
    this.getFile()
  }

  getFile() {
    const uri = location.protocol + "//" + location.host + "/data/summary"
    axios.get(uri)
      .then((res) => {
        this.data = res.data
        this.setState({toggle: !this.state.toggle})
      })
      .catch((err) => {
      })
  }
  // For Test - End

  render() {
    return (
      <div>
        <NavigatorBar
          title={ this.props.project }
          items={ [
            <NavigatorItem
              key="register"
              label="Register User"
              page="/auth/form/register"
              disabled={ this.props.user !== "root" }
            />,
            <NavigatorItem
              key="logout"
              label="Logout"
              page="/auth/form/logout"
            />
          ] }
        />
        <div>
          <p className="text-center">Hello { this.props.user }! This is the main page.</p>
          { true && <FileExplorerBox path="/data" onView={ file => console.log(file) } /> }
          { false && <FileUploaderButton path="/data" /> }
          { false && <FiltableTable source={ this.data } /> }
        </div>
      </div>
    )
  }

}
