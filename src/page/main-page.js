import React, {useRef, useReducer} from "react"
import PropTypes from "prop-types"

import DirectoryListBox from "../component/directory-list-box.js"
import FileExplorerBox from "../component/file-explorer-box.js"
import FileUploaderButton from "../component/file-uploader-button.js"
import FunctionalTable from "../component/functional-table.js"
import MainFrame from "../component/main-frame.js"
import NavigatorBar from "../component/navigator-bar.js"
import NavigatorItem from "../component/navigator-item.js"
import TabFrame from "../component/tab-frame.js"

const MainPage = React.memo(props => {
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0)

  const dirpath = useRef("")

  const table = useRef({
    filename: "",
    content : {}
  })

  const handleSelect = nodepath => {
    dirpath.current = nodepath
    forceUpdate()
  }

  const handleView = data => {
    table.current = data
    forceUpdate()
  }

  return (
    <div className="container-fluid">
      <NavigatorBar
        title={ props.project }
        items={ [
          <NavigatorItem
            key="register"
            label="Register User"
            page="/auth/form/register"
            disabled={ props.user !== "root" }
          />,
          <NavigatorItem
            key="logout"
            label="Logout"
            page="/auth/form/logout"
          />
        ] }
      />
      <MainFrame
        head={ <p className="text-center">Hello { props.user }! This is the main page.</p> }
        main={ <FunctionalTable source={ table.current.content } title={ table.current.filename } /> }
        left={
          <TabFrame
            labels={ ["Case", "Explorer", "Upload"] }
            items={ [
              <DirectoryListBox path="/data" onSelect={ handleSelect } />,
              <FileExplorerBox path={ dirpath.current } onView={ handleView } />,
              <FileUploaderButton path="/data" />
            ] }
          />
        }
      />
    </div>
  )
}, (p, n) => true)

MainPage.propTypes = {
  project : PropTypes.string,
  user    : PropTypes.string
}

MainPage.defaultProps = {
  project : "unaffiliated",
  user    : "anonymous"
}

export default MainPage
