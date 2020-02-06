import React, { useRef, useCallback, useReducer } from "react"
import PropTypes from "prop-types"

import DirectoryListBox from "../component/directory-list-box.js"
import FileExplorerBox from "../component/file-explorer-box.js"
import FileUploaderButton from "../component/file-uploader-button.js"
import FunctionalTableBox from "../component/functional-table-box.js"
import MainFrame from "../component/main-frame.js"
import NavigatorBar from "../component/navigator-bar.js"
import NavigatorItem from "../component/navigator-item.js"
import TabFrame from "../component/tab-frame.js"
import TerminalBox from "../component/terminal-box.js"

const MainPage = React.memo(props => {
  const [ignored, forceUpdate]  = useReducer(x => x + 1, 0)
  const [dirId,   reloadDir]    = useReducer(x => x + 1, 0)

  const refs = useRef({
    case    : React.createRef(),
    summary : React.createRef(),
    explorer: React.createRef(),
    upload  : React.createRef()
  })

  const dirpath   = useRef("")
  const filepath  = useRef("")

  const handleSelectDirectory = useCallback(dirPath => {
    dirpath.current = dirPath
    refs.current.summary.current.click()
    forceUpdate()
  }, [true])

  const handleSelectFile = useCallback(filePath => {
    filepath.current = filePath
    forceUpdate()
  }, [true])

  const handleDoneFileUpload = useCallback(() => {
    reloadDir()
  }, [true])

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
        head={ <p className="text-center">Hello { props.user }!</p> }
        main={ <FunctionalTableBox path={ filepath.current } user={ props.user } /> }
        left={
          <TabFrame
            labels={ ["Case", "Summary", "Explorer", "Upload"] }
            items={ [
              <DirectoryListBox key={ dirId } path="/data" onSelect={ handleSelectDirectory } />,
              <FileExplorerBox key={ dirpath.current } path={ dirpath.current } mode="vft" onSelect={ handleSelectFile } />,
              <FileExplorerBox key={ dirpath.current } path={ dirpath.current } onSelect={ handleSelectFile } />,
              <FileUploaderButton path="/data" onDone={ handleDoneFileUpload } />
            ] }
            refs={ [refs.current.case, refs.current.summary, refs.current.explorer, refs.current.upload] }
          />
        }
      />
    </div>
  )
})

MainPage.propTypes = {
  project : PropTypes.string,
  user    : PropTypes.string
}

MainPage.defaultProps = {
  project : "unaffiliated",
  user    : "anonymous"
}

export default MainPage
