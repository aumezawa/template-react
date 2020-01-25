import React, { useEffect } from "react"
import PropTypes from "prop-types"

import socketio from "socket.io-client"
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import "xterm/css/xterm.css"

const TerminalBox = React.memo(props => {
  const ref = React.createRef()

  useEffect(() => {
    const terminal = new Terminal({ cursorBlink: true, cursorStyle: "underline" })
    const fitAddon = new FitAddon()

    terminal.loadAddon(fitAddon)
    terminal.open(ref.current)
    fitAddon.fit()

    const query = `?user=${ props.user }&cmd=${ props.command }&cols=${ terminal.cols }&rows=${ terminal.rows }`
    const io = socketio(query, { path: props.path })
    terminal.onData(data => io.emit("input", data))
    io.on("output", data => terminal.write(data))
  }, [props.path, props.user, props.command])

  return <div ref={ ref } className="h-100" ></div>
})

TerminalBox.propTypes = {
  path    : PropTypes.string,
  user    : PropTypes.string,
  command : PropTypes.string
}

TerminalBox.defaultProps = {
  path    : "/terminal",
  user    : "anonymous",
  command : ""
}

export default TerminalBox
