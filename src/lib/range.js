export default (from, to) => {
  return Array.from({ length: (to - from + 1) }, (value, index) => index + from)
}
