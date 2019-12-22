export default (waitSec, next) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(next)
    }, waitSec * 1000)
  })
}
