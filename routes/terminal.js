const os = require("os")
const pty = require("node-pty")  // Note: Do not use import
const socketio = require("socket.io")

const shell = os.platform() === "win32" ? "powershell.exe" : "bash"

const terminal = server => {
  const io = socketio(server, { path: "/terminal" })
  io.on("connection", socket => {
    const ptyProcess = pty.spawn(shell, [socket.handshake.query.cmd || ""], {
      name: "xterm-color",
      cols: Number(socket.handshake.query.cols || 80),
      rows: Number(socket.handshake.query.rows || 24),
    })

    socket.on("input", data => ptyProcess.write(data))
    ptyProcess.on("data", data => socket.emit("output", data))
  })
}

module.exports = terminal
