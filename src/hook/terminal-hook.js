import os from "os"
import path from "path"

import project from "../../package.json"

const dirPath = path.isAbsolute(project.storage) ? project.storage : path.join(__dirname, "..", "..", project.storage)

const TerminalHook = (orgCommand) => {
  const command = orgCommand.replace("PATH:/data", dirPath).replace("DBGSYMBOL:", "")
  const cmd = command.split(" ")[0]

  switch (cmd) {
    case "less":
      return os.platform() === "win32" ? ["more", ...command.split(" ").slice(1)].join(" ") : command

    case "gdb":
      return os.platform() === "win32" ? `echo "no debugger support..."` : command

    default:
      return command
  }
}

export default TerminalHook
