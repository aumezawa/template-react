import crypto from "crypto"
import fs from "fs"
import path from "path"
import readline from "readline"

const filename = "userlist.json"
const filepath = path.join(__dirname, filename)

var override = false
process.argv.forEach(arg => {
  if (arg === "--override") {
    override = true
  }
})


// Note: if the file already exists, do nothing
if (!override) {
  var userlist = {}
  try {
    userlist = JSON.parse(fs.readFileSync(filepath, "utf8"))
  } catch {
    ;
  }
  if (userlist.root) {
    console.log("Info : User database file already exists.")
    process.exit(0)
  }
}


// Note: get a password from stdin
const rl = readline.createInterface({
  input : process.stdin,
  output: process.stdout
})

rl.stdoutMuted = true

console.log("Input root password (between 4 - 16 characters with [0-9a-zA-Z]):")
rl.question("", (password) => {
  console.log("\n")

  // Note: if invalid, do nothing
  var isValid = true
  if (password.length <  4)               { isValid = false }
  if (password.length > 16)               { isValid = false }
  if (!password.match(/^[0-9a-zA-Z]+$/))  { isValid = false }
  if (!isValid) {
    console.log("Error: Password is invalid...")
    rl.close()
    process.exit(0)
  }

  // Note: create a new file
  var writeData = JSON.stringify({
    "root": crypto.createHash("sha256").update(password, "utf8").digest("hex")
  })
  try {
    fs.writeFileSync(filepath, writeData)
    console.log("Info : User database file was created successfully.")
  } catch {
    console.log("Error: User database file was not created...")
  }
  rl.close()
  process.exit(0)
})

rl._writeToOutput = (char) => {
  if (char.match(/\n/)) {
    return
  }
  rl.output.write("*")
}
