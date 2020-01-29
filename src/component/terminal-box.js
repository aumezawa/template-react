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

    if (!props.disabled) {
      fitAddon.fit()

      const query = `?user=${ props.user }&cmd=${ props.command }&cols=${ terminal.cols }&rows=${ terminal.rows }`
      const io = socketio(encodeURI(query), { path: props.path })
      terminal.onData(data => io.emit("input", data))
      io.on("output", data => terminal.write(data))
    }
  }, [props.path, props.user, props.command, props.disabled])

  return <div ref={ ref } className={ props.className}></div>
})

TerminalBox.propTypes = {
  className : PropTypes.string,
  path      : PropTypes.string,
  user      : PropTypes.string,
  command   : PropTypes.string,
  disabled  : PropTypes.bool
}

TerminalBox.defaultProps = {
  className : "h-100",
  path      : "/terminal",
  user      : "anonymous",
  command   : "",
  disabled  : false
}

export default TerminalBox
