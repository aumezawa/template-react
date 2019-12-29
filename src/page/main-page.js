import React from "react"
import PropTypes from "prop-types"

// For Table Test - Start
import axios from "axios"
// For Table Test - End

import FileUploaderButton from "../component/file-uploader-button.js"
import FiltableTable from "../component/filtable-table.js"
import NavigatorBar from "../component/navigator-bar.js"
import NavigatorItem from "../component/navigator-item.js"

import FileFrom from "../component/file-form.js"

export default class MainPage extends React.PureComponent {

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
        <div className="text-center">
          <p>Hello { this.props.user }! This is the main page.</p>
          <FileUploaderButton path="/data" />
          <FiltableTable source={ this.data } />
        </div>
      </div>
    )
  }

}
