module.exports = (waitSec, pass) => {
  return new Promise((resolve) => {
    setTimeout(() => { resolve(pass) }, waitSec * 1000)
  })
}
