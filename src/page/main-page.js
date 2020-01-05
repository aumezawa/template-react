import React from "react"
import PropTypes from "prop-types"

import FileExplorerBox from "../component/file-explorer-box.js"
import FileUploaderButton from "../component/file-uploader-button.js"
import FiltableTable from "../component/filtable-table.js"
import MainFrame from "../component/main-frame.js"
import NavigatorBar from "../component/navigator-bar.js"
import NavigatorItem from "../component/navigator-item.js"
import TabFrame from "../component/tab-frame.js"

export default class MainPage extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      toggle: false
    }
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

  render() {
    return (
      <div className="container-fluid">
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
        <MainFrame
          main={
            <FiltableTable source={ this.data.table } title={ this.data.title } />
          }
          head={
            <p className="text-center">Hello { this.props.user }! This is the main page.</p>
          }
          left={
            <TabFrame
              labels={ ["Case", "Explorer", "Upload"] }
              items={ [
                <div></div>,
                <FileExplorerBox path="/data" onView={ data => this.handleView(data) } />,
                <FileUploaderButton path="/data" center margin />
              ] }
            />
          }

        />
      </div>
    )
  }

  handleView(data) {
    this.data.title = data.file
    this.data.table = data.table
    this.setState({
      toggle: !this.state.toggle
    })
  }

}
