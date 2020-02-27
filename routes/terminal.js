const os = require("os")
const pty = require("node-pty")  // Note: Do not use import
const socketio = require("socket.io")

import TerminalHook from "../src/hook/terminal-hook.js"

const shell = os.platform() === "win32" ? "powershell.exe" : "bash"
const opt   = os.platform() === "win32" ? [] : ["-c"]

const terminal = server => {
  const io = socketio(server, { path: "/terminal" })
  io.on("connection", socket => {
    const command = socket.handshake.query.cmd ? [...opt, TerminalHook(decodeURI(socket.handshake.query.cmd))] : []
    const ptyProcess = pty.spawn(shell, command, {
      name: "xterm-color",
      cols: Number(socket.handshake.query.cols || 80),
      rows: Number(socket.handshake.query.rows || 24),
    })

    socket.on("input", data => ptyProcess.write(data))
    ptyProcess.on("data", data => socket.emit("output", data))

    socket.on("disconnect", () => ptyProcess.end())
  })
}

module.exports = terminal
