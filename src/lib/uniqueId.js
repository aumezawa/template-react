import padding from "./padding.js"

export default () => {
  return padding(Date.now().toString(16), 12) + padding(Math.floor(Math.pow(16, 4) * Math.random()).toString(16), 4)
}
