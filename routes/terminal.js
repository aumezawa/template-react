const os = require("os")
const pty = require("node-pty")  // Note: Do not use import
const socketio = require("socket.io")

const shell = os.platform() === "win32" ? "powershell.exe" : "bash"
const opt   = os.platform() === "win32" ? [] : ["-c"]

const terminal = server => {
  const io = socketio(server, { path: "/terminal" })
  io.on("connection", socket => {
    const command = (socket.handshake.query.cmd) ? [socket.handshake.query.cmd] : []
    const args = (socket.handshake.query.args) ? (socket.handshake.query.args || "").split(",") : []
    const ptyProcess = pty.spawn(shell, [...opt, ...command, ...args], {
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
