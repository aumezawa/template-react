import React from "react"
import PropTypes from "prop-types"

// For Table Test - Start
import axios from "axios"
// For Table Test - End

import FileUploaderButton from "../component/file-uploader-button.js"
import FiltableTable from "../component/filtable-table.js"
import NavigatorBar from "../component/navigator-bar.js"
import NavigatorItem from "../component/navigator-item.js"

import TreeNode from "../component/tree-node.js"

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
    this.ls()
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

  ls() {
    const uri = location.protocol + "//" + location.host + "/data?cmd=ls"
    axios.get(uri)
      .then((res) => {
        this.source = res.data.ls
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
        <div className="text-center">
          <p>Hello { this.props.user }! This is the main page.</p>
          { true && <TreeNode source={ this.source } isName={ dict => dict.name } isLeaf={ dict => dict.file } isChild={ dict => dict.children } onClick={ v => console.log(v) } /> }
          { true && <FileUploaderButton path="/data" /> }
          { true && <FiltableTable source={ this.data } /> }
        </div>
      </div>
    )
  }

}
