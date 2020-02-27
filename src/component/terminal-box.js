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
    let socket = undefined

    terminal.loadAddon(fitAddon)
    terminal.open(ref.current)

    if (!props.disabled) {
      fitAddon.fit()

      const query = `?user=${ props.user }&cmd=${ props.command }&cols=${ terminal.cols }&rows=${ terminal.rows }`
      socket = socketio(encodeURI(query), { path: props.path })
      terminal.onData(data => socket.emit("input", data))
      socket.on("output", data => terminal.write(data))
    }

    return () => {
      terminal.dispose()
      if (socket) {
        socket.disconnect()
      }
    }
  }, [props.path, props.user, props.command, props.disabled])

  return (
    <div className={ `${props.className} d-flex flex-column` }>
      <div className="text-monospace font-weight-bold text-white bg-dark py-1 px-3">{ props.name }</div>
      <div ref={ ref } className="flex-grow-1"></div>
    </div>
  )
})

TerminalBox.propTypes = {
  className : PropTypes.string,
  name      : PropTypes.string,
  path      : PropTypes.string,
  user      : PropTypes.string,
  command   : PropTypes.string,
  disabled  : PropTypes.bool
}

TerminalBox.defaultProps = {
  className : "h-100",
  name      : "unnamed",
  path      : "/terminal",
  user      : "anonymous",
  command   : "",
  disabled  : false
}

export default TerminalBox
