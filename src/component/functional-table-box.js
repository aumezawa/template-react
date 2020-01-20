import React, { useEffect, useRef, useCallback, useReducer } from "react"
import PropTypes from "prop-types"

import axios from "axios"
import path from "path"

import AutoReloader from "./auto-reloader.js"
import FunctionalTable from "./functional-table.js"

import LocalDate from "../lib/date.js"

const FunctionalTableBox = React.memo(props => {
  const [ignored, forceUpdate]  = useReducer(x => x + 1, 0)
  const [formId,  clearForm]    = useReducer(x => x + 1, 0)

  const table     = useRef({})
  const comments  = useRef({})

  const loadTable = () => new Promise((resolve, reject) => {
    if (props.path === "") {
      return resolve()
    }
    const uri = location.protocol + "//" + location.host + props.path + "?cmd=json"

    axios.get(uri)
    .then(res => {
      if (!res.data.success) {
        throw new Error(`${ path.basename(props.path) } was not found.`)
      }
      table.current = res.data.table
      return resolve()
    })
    .catch(err => reject(err))
  })

  const loadComment = () => new Promise((resolve, reject) => {
    if (props.path === "") {
      return resolve()
    }
    const uri = location.protocol + "//" + location.host + props.path + "?cmd=comment"

    axios.get(uri)
    .then(res => {
      if (!res.data.success) {
        throw new Error(`${ path.basename(props.path) } was not found.`)
      }
      comments.current = res.data.comments
      return resolve()
    })
    .catch(err => reject(err))
  })

  useEffect(() => {
    loadTable()
    .then(() => loadComment())
    .then(() => forceUpdate())
    .catch(err => alert(err.message))
  }, [props.path])

  const handleSubmitComment = useCallback(data => {
    const uri = location.protocol + "//" + location.host + props.path
    let params = new URLSearchParams()
    params.append("cmd", "comment")
    params.append("line", `${ data.line }`)
    params.append("comment", JSON.stringify({
      author  : props.user,
      date    : LocalDate(9).toISOString().slice(0, 16).replace(/-/g, "/").replace(/T/g, " "),
      comment : data.comment
    }))

    axios.post(uri, params)
    .then(res => {
      if (!res.data.success) {
        throw new Error("Comment Failed")
      }
      clearForm()
      return loadComment()
    })
    .then(() => forceUpdate())
    .catch(err => alert(err.message))
  }, [props.path, props.user])

  const handleChange = useCallback(() => {
    loadComment()
    .then(() => forceUpdate())
    .catch(err => undefined)
  }, [props.path])

  return (
    <>
      <AutoReloader
        path={ props.path + ".cmt" }
        type="file"
        onChange={ handleChange }
      />
      <FunctionalTable
        className={ props.className }
        table={ table.current }
        name={ path.basename(props.path) }
        rows={ 5000 }
        user={ props.user }
        comments={ comments.current }
        formId={ formId }
        onComment={ handleSubmitComment }
      />
    </>
  )
})

FunctionalTableBox.propTypes = {
  className : PropTypes.string,
  path      : PropTypes.string,
  user      : PropTypes.string
}

FunctionalTableBox.defaultProps = {
  className : "",
  path      : "",
  user      : "anonymous"
}

export default FunctionalTableBox
