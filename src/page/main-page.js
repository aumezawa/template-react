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

  const refsLeft = useRef({
    project : React.createRef(),
    summary : React.createRef(),
    explorer: React.createRef()
  })

  const refsBody = useRef({
    summary : React.createRef(),
    view    : React.createRef(),
    terminal: React.createRef()
  })

  const dirpath   = useRef("")
  const filepath  = useRef("")

  const handleSelectProject = useCallback(data => {
    dirpath.current = data.path
    refsLeft.current.summary.current.click()
    forceUpdate()
  }, [true])

  const handleSelectFile = useCallback(data => {
    switch (data.action) {
      case "view":
        filepath.current = data.path
        refsBody.current.view.current.click()
        break

      default:
        break
    }
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
            body={
              <TabFrame
                labels={ ["Summary", "View", "Terminal"] }
                items={ [
                  <></>,
                  <FunctionalTableBox path={ filepath.current } user={ props.user } />,
                  <TerminalBox command="" disabled={ true }/>
                ] }
                refs={ [refsBody.current.summary, refsBody.current.view, refsBody.current.terminal] }
                overflow={ false }
              />
            }
            left={
              <TabFrame
                labels={ ["Project", "Summary", "Explorer"] }
                items={ [
                  <ProjectExplorerBox key={ dirId } path="/data" onSelect={ handleSelectProject } />,
                  <FileExplorerBox key={ dirpath.current } path={ dirpath.current } mode="vft" onSelect={ handleSelectFile } />,
                  <FileExplorerBox key={ dirpath.current } path={ dirpath.current } onSelect={ handleSelectFile } />,
                ] }
                refs={ [refsLeft.current.project, refsLeft.current.summary, refsLeft.current.explorer] }
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
