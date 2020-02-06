import React, { useEffect, useRef } from "react"
import PropTypes from "prop-types"

import axios from "axios"
import path from "path"

const AutoReloader = React.memo(props => {
  const last  = useRef(undefined)
  const timer = useRef(undefined)

  const monitorChange = () => {
    const uri = location.protocol + "//" + location.host + props.path
    switch (props.type) {
      case "file":
        axios.get(uri + "?cmd=stat")
        .then(res => {
          if (!res.data.success) {
            throw new Error(`${ path.basename(props.path) } was not found.`)
          }
          if (res.data.update !== last.current) {
            handleChange()
          }
          last.current = res.data.update
        })
        .catch(err => undefined)
        break

      case "directory":
        axios.get(uri + "?cmd=ls")
        .then(res => {
          if (!res.data.success) {
            throw new Error(`${ path.basename(props.path) } was not found.`)
          }
          let current = JSON.stringify(res.data.ls)
          if (current !== last.current) {
            handleChange()
          }
          last.current = current
        })
        .catch(err => undefined)
        break

      default:
        break
    }
  }

  useEffect(() => {
    clearTimeout(timer.current)
    if (!props.disabled) {
      timer.current = setInterval(monitorChange, props.interval * 1000)
    }
    return () => clearTimeout(timer.current)
  }, [props.path, props.disabled])

  const handleChange = () => {
    if (props.onChange) {
      props.onChange()
    }
  }
  return <></>
})

AutoReloader.propTypes = {
  path    : PropTypes.string,
  type    : PropTypes.string,
  interval: PropTypes.number,
  disabled: PropTypes.bool,
  onChange: PropTypes.func
}

AutoReloader.defaultProps = {
  path    : "",
  type    : "",
  interval: 10,
  disabled: true,
  onChange: undefined
}

export default AutoReloader
