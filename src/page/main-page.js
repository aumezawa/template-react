import React, { useRef, useCallback, useReducer } from "react"
import PropTypes from "prop-types"

import DropdownDivider from "../component/dropdown-divider.js"
import DropdownHeader from "../component/dropdown-header.js"
import FileExplorerBox from "../component/file-explorer-box.js"
import FunctionalTableBox from "../component/functional-table-box.js"
import LayerFrame from "../component/layer-frame.js"
import MainFrame from "../component/main-frame.js"
import NavigatorBar from "../component/navigator-bar.js"
import NavigatorItem from "../component/navigator-item.js"
import ProjectExplorerBox from "../component/project-explorer-box.js"
import TabFrame from "../component/tab-frame.js"
import TerminalBox from "../component/terminal-box.js"

import sleep from "../lib/sleep.js"

const MainPage = React.memo(props => {
  const [ignored, forceUpdate]  = useReducer(x => x + 1, 0)
  const [dirKey,  reloadDir]    = useReducer(x => x + 1, 0)

  const refsLeft = useRef({
    project : React.createRef(),
    summary : React.createRef(),
    explorer: React.createRef()
  })

  const refsBody = useRef({
    summary : React.createRef(),
    viewer  : React.createRef(),
    terminal: React.createRef()
  })

  const explorerDirpath = useRef("")
  const viewerFilepath  = useRef("")
  const terminalCommand = useRef("")
  const terminalActive  = useRef(false)
  const terminalName    = useRef("No Data")

  const handleSelectProject = useCallback(data => {
    explorerDirpath.current = data.path
    refsLeft.current.summary.current.click()
    forceUpdate()
  }, [true])

  const handleSelectFile = useCallback(data => {
    switch (data.action) {
      case "view":
        viewerFilepath.current = data.path
        refsBody.current.viewer.current.click()
        forceUpdate()
        break

      case "viewInTerminal":
        terminalCommand.current = "less PATH:" + data.path
        terminalActive.current = true
        terminalName.current = data.path
        refsBody.current.terminal.current.click()
        sleep(1)
        .then(() => forceUpdate())
        break

      case "debugger":
        terminalCommand.current = "gdb DBGSYMBOL: PATH:" + data.path
        terminalActive.current = true
        terminalName.current = data.path
        refsBody.current.terminal.current.click()
        sleep(1)
        .then(() => forceUpdate())
        break

      default:
        break
    }
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
              <DropdownHeader key="header" label={ `Version: ${ props.version }` } />,
              <DropdownDivider key="divider" />,
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
                  <FunctionalTableBox path={ viewerFilepath.current } user={ props.user } />,
                  <TerminalBox command={ terminalCommand.current } name={ terminalName.current } disabled={ !terminalActive.current } />
                ] }
                refs={ [refsBody.current.summary, refsBody.current.viewer, refsBody.current.terminal] }
                overflow={ false }
              />
            }
            left={
              <TabFrame
                labels={ ["Project", "Summary", "Explorer"] }
                items={ [
                  <ProjectExplorerBox key={ dirKey } path="/data" user={ props.user } onSelect={ handleSelectProject } />,
                  <FileExplorerBox key={ explorerDirpath.current } path={ explorerDirpath.current } mode="vft" onSelect={ handleSelectFile } />,
                  <FileExplorerBox key={ explorerDirpath.current } path={ explorerDirpath.current } onSelect={ handleSelectFile } />,
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
  version : PropTypes.string,
  user    : PropTypes.string
}

MainPage.defaultProps = {
  project : "unaffiliated",
  author  : "unnamed",
  version : "no version",
  user    : "anonymous"
}

export default MainPage
