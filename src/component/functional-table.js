import React, { useState, useEffect, useRef, useCallback, useReducer } from "react"
import PropTypes from "prop-types"

import CommentEditorModal from "./comment-editor-modal.js"
import DateFilterForm from "./date-filter-form.js"
import EmbeddedButton from "./embedded-button.js"
import Modal from "./modal.js"
import Pagination from "../component/pagination.js"
import TextFilterForm, { MODE_INCLUDED, MODE_NOT_INCLUDED, MODE_REGEX } from "./text-filter-form.js"

import uniqueId from "../lib/uniqueId.js"

const FunctionalTable = React.memo(props => {
  const [page, setPage] = useState(1)

  const [ignored, forceUpdate]  = useReducer(x => x + 1, 0)

  const label     = useRef(undefined)
  const filter    = useRef({ "#": false })
  const rows      = useRef(0)
  const line      = useRef(0)
  const comments  = useRef([])

  const id = useRef({
    text    : "modal-" + uniqueId(),
    date    : "modal-" + uniqueId(),
    comment : "modal-" + uniqueId()
  })

  useEffect(() => {
    filter.current = { "#": false }
    setPage(1)
  }, [props.table])

  useEffect(() => {
    setPage(1)
  }, [rows.current])

  useEffect(() => {
    comments.current = (`${ line.current }` in props.comments) ? props.comments[`${ line.current }`] : []
    forceUpdate()
  }, [props.comments])

  const handleClickFilter = useCallback(e => {
    label.current = e.target.title
  }, [true])

  const handleSubmitTextFilter = useCallback(data => {
    filter.current[label.current] = Object.assign({ type: "text" }, data)
    forceUpdate()
  }, [true])

  const handleCancelTextFilter = useCallback(() => {
    delete filter.current[label.current]
    forceUpdate()
  }, [true])

  const handleSubmitDateFilter = useCallback(data => {
    filter.current[label.current] = Object.assign({ type: "date" }, data)
    forceUpdate()
  }, [true])

  const handleCancelDateFilter = useCallback(() => {
    delete filter.current[label.current]
    forceUpdate()
  }, [true])

  const handleChangePage = useCallback(page => {
    setPage(page)
  }, [true])

  const handleClickFilterComment = useCallback(() => {
    filter.current["#"] = !filter.current["#"]
    forceUpdate()
  }, [true])

  const handleClickComment = useCallback(e => {
    line.current = Number(e.target.title)
    comments.current = (`${ line.current }` in props.comments) ? props.comments[`${ line.current }`] : []
    forceUpdate()
  }, [props.comments])

  const handleSubmitComment = useCallback(data => {
    if (props.onComment) {
      props.onComment({
        line    : line.current,
        comment : data.text
      })
    }
  }, [props.onComment])

  const renderTitle = () => {
    try {
      return <h5>{ `${ props.name } - ${ props.table.format.title }` }</h5>
    } catch {
      return <h5>{ `${ props.name } - Untitled` }</h5>
    }
  }

  const renderHeader = () => {
    try {
      const format = props.table.format
      let header = []
      if (format.hasHeader) {
        if (format.hasIndex) {
          header = [<th key="index" scope="col">#</th>]
        }
        header = header.concat(format.labels.map(label => (
          <th key={ label.name } scope="col">
            { label.name }
            <EmbeddedButton
              label="Filter"
              title={ label.name }
              on={ label.name in filter.current }
              toggle="modal"
              target={ label.type === "date" ? id.current.date : id.current.text }
              onClick={ handleClickFilter }
            />
          </th>
        )))
        if (props.comments) {
          header.push(
            <th key="comment" scope="col">
              <EmbeddedButton
                label="#"
                on={ filter.current["#"] }
                onClick={ handleClickFilterComment }
              />
            </th>
          )
        }
      }
      return <tr>{ header }</tr>
    } catch {
      return <tr><th scope="col">Invalid input data...</th></tr>
    }
  }

  const renderBody = () => {
    try {
      rows.current = 0
      const format = props.table.format
      const data = props.table.data
      return data.map((datum, index) => {
        let line = index + 1
        if (!format.labels.reduce((acc, label) => {
          return acc && isFiltered(label.name, datum[label.name]) && isFilteredByComment(line)
        }, true)) { return }

        rows.current++
        if (rows.current <= (page - 1) * props.rows || rows.current > page * props.rows) {
          return
        }

        let row = []
        if (format.hasIndex) {
          row = [<th key={ "index" + line } className="text-right" scope="row" >{ `${ line }:` }</th>]
        }
        row = row.concat(format.labels.map(label => {
          let wrapping = (label.name === format.contentKey) ? "text-wrap text-break" : "text-nowrap"
          return <td key={ label.name + line } className={ `${ wrapping }` }>{ datum[label.name] }</td>
        }))
        if (props.comments) {
          row.push(<td key={ "comment" + line } scope="col">
            <EmbeddedButton label="#" title={ `${ line }` } on={ `${ line }` in props.comments }
              toggle="modal" target={ id.current.comment } onClick={ handleClickComment } /></td>
          )
        }
        return <tr key={ "row" + line }>{ row }</tr>
      })
    } catch {
      return []
    }
  }

  const isFiltered = (key, datum) => {
    if (!(key in filter.current)) {
      return true
    }

    switch (filter.current[key].type) {
      case "text":
        switch (filter.current[key].mode) {
          case MODE_INCLUDED:     return  datum.includes(filter.current[key].text) ? true : false
          case MODE_NOT_INCLUDED: return !datum.includes(filter.current[key].text) ? true : false
          case MODE_REGEX:        return ((new RegExp(filter.current[key].text)).exec(datum) !== null) ? true : false
          default:                return false
        }

      case "date":
        let at = new Date(datum)
        if (at.toString() === "Invalid Date")                                       { return false }
        if (filter.current[key].enable.from && filter.current[key].date.from > at)  { return false }
        if (filter.current[key].enable.to   && filter.current[key].date.to   < at)  { return false }
        return true

      default:
        return true
    }
  }

  const isFilteredByComment = line => ((!filter.current["#"] || `${ line }` in props.comments) ? true : false)

  return (
    <div className={ props.className }>
      <Modal
        id={ id.current.text }
        title="Filter text"
        body={
          <TextFilterForm
            className="my-0"
            onSubmit={ handleSubmitTextFilter }
            onCancel={ handleCancelTextFilter }
          />
        }
      />
      <Modal
        id={ id.current.date }
        title="Filter date"
        body={
          <DateFilterForm
            className="my-0"
            onSubmit={ handleSubmitDateFilter }
            onCancel={ handleCancelDateFilter }
          />
        }
      />
      <CommentEditorModal
        id={ id.current.comment }
        formId={ props.formId }
        title={ `New/View comment, line: ${ line.current } ( ${ comments.current.length } comments ) ` }
        user={ props.user }
        comments={ comments.current }
        onSubmit={ handleSubmitComment }
      />
      <div className="d-flex flex-column h-100">
        { renderTitle() }
        <div className="table-responsive">
          <table className="table table-hover table-fixed text-monospace">
            <thead className="thead-dark">{ renderHeader() }</thead>
            <tbody>{ renderBody() }</tbody>
            <tfoot></tfoot>
          </table>
        </div>
        <Pagination
          className="mt-2"
          current={ page }
          last={ Math.floor(rows.current / props.rows) + 1 }
          onChange={ handleChangePage }
        />
      </div>
    </div>
  )
})

FunctionalTable.propTypes = {
  className : PropTypes.string,
  table     : PropTypes.object,
  name      : PropTypes.string,
  rows      : PropTypes.number,
  user      : PropTypes.string,
  comments  : PropTypes.object,
  formId    : PropTypes.number,
  onComment : PropTypes.func
}

FunctionalTable.defaultProps = {
  className : "",
  table     : {},
  name      : "Unnamed",
  rows      : 5000,
  user      : "anonymous",
  comments  : {},
  formId    : 0,
  onComment : undefined
}

export default FunctionalTable
