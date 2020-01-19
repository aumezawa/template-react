export default timezone => {
  let now = new Date()
  now.setTime(now.getTime() + 1000 * 60 * 60 * timezone)
  return now
}
