import child_process from "child_process"

const StorageHook = (command, path) => new Promise(resolve => {
  switch (command) {
    case "zip":
      /*
      child_process.exec("<cmd>", (err, stdout, stderr) => {
        return
      })
      */
      return resolve()

    case "unzip":
      /*
      child_process.exec("<cmd>", (err, stdout, stderr) => {
        return
      })
      */
      return resolve()

    default:
      return resolve()
  }
})

export default StorageHook
