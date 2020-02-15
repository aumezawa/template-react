import React, { useRef, useCallback, useReducer } from "react"
import PropTypes from "prop-types"

import ProjectExplorerBox from "../component/project-explorer-box.js"
import FileExplorerBox from "../component/file-explorer-box.js"
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
    project : React.createRef(),
    summary : React.createRef(),
    explorer: React.createRef()
  })

  const dirpath   = useRef("")
  const filepath  = useRef("")

  const handleSelectProject = useCallback(data => {
    dirpath.current = data.path
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
            labels={ ["Project", "Summary", "Explorer"] }
            items={ [
              <ProjectExplorerBox key={ dirId } path="/data" onSelect={ handleSelectProject } />,
              <FileExplorerBox key={ dirpath.current } path={ dirpath.current } mode="vft" onSelect={ handleSelectFile } />,
              <FileExplorerBox key={ dirpath.current } path={ dirpath.current } onSelect={ handleSelectFile } />,
            ] }
            refs={ [refs.current.project, refs.current.summary, refs.current.explorer] }
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
