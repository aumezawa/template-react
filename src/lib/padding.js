export default (str, len) => {
  return ("0000000000000000" + str).slice(-len)
}
