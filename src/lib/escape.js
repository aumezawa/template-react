const exports = {}

exports.regex = str => str.replace(/[-\/\\^$*+?.()|\[\]{}]/g, "\\$&")

export default exports
