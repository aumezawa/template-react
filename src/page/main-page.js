import React, { useRef, useCallback, useReducer } from "react"
import PropTypes from "prop-types"

import ProjectExplorerBox from "../component/project-explorer-box.js"
import FileExplorerBox from "../component/file-explorer-box.js"
import FunctionalTableBox from "../component/functional-table-box.js"
import LayerFrame from "../component/layer-frame.js"
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
      <LayerFrame
        head={
          <NavigatorBar
            title={ props.project }
            items={ [
              <NavigatorItem key="register" label="Register User" page="/auth/form/register" disabled={ props.user !== "root" } />,
              <NavigatorItem key="logout"   label="Logout"        page="/auth/form/logout"   disabled={ false } />
            ] }
          />
        }
        body={
          <MainFrame
            head={ <div className="text-center my-1">Hello { props.user }!</div> }
            body={ <FunctionalTableBox className="h-100" path={ filepath.current } user={ props.user } /> }
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
        }
        foot={ <div className="text-light text-right bg-dark mt-2 py-1 px-2">Coded by { props.author }, powered by React</div> }
        bodyOverflow={ false }
      />
    </div>
  )
})

MainPage.propTypes = {
  project : PropTypes.string,
  author  : PropTypes.string,
  user    : PropTypes.string
}

MainPage.defaultProps = {
  project : "unaffiliated",
  author  : "unnamed",
  user    : "anonymous"
}

export default MainPage
