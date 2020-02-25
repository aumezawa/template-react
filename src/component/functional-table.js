import React, { useEffect, useRef, useCallback, useReducer } from "react"
import PropTypes from "prop-types"

import CommentEditorModal from "./comment-editor-modal.js"
import DateFilterForm from "./date-filter-form.js"
import EmbeddedButton from "./embedded-button.js"
import Modal from "./modal.js"
import Pagination from "../component/pagination.js"
import SelectForm from "../component/select-form.js"
import TextFilterForm, { MODE_INCLUDED, MODE_NOT_INCLUDED, MODE_REGEX } from "./text-filter-form.js"

import escape from "../lib/escape.js"
import uniqueId from "../lib/uniqueId.js"

const FunctionalTable = React.memo(props => {
  const [ignored, forceUpdate]  = useReducer(x => x + 1, 0)

  const ROWS = [ 1000, 3000, 5000 ]

  const contentPage     = useRef(1)
  const contentMaxRows  = useRef(ROWS[0])
  const contentRows     = useRef(0)
  const filterLabel     = useRef("")
  const filterCondition = useRef({ "#": false })
  const commentLine     = useRef(0)
  const commentMessage  = useRef("")
  const comments        = useRef([])

  const id = useRef({
    text    : "modal-" + uniqueId(),
    date    : "modal-" + uniqueId(),
    comment : "modal-" + uniqueId()
  })

  useEffect(() => {
    filterCondition.current = { "#": false }
    contentPage.current = 1
    forceUpdate()
  }, [props.table])

  useEffect(() => {
    contentPage.current = 1
    forceUpdate()
  }, [contentRows.current,])

  useEffect(() => {
    if (props.comments) {
      comments.current = (String(commentLine.current) in props.comments) ? props.comments[String(commentLine.current)] : []
      forceUpdate()
    }
  }, [props.comments])

  const handleClickFilter = useCallback(data => {
    filterLabel.current = data.parent
  }, [true])

  const handleSubmitTextFilter = useCallback(data => {
    filterCondition.current[filterLabel.current] = Object.assign({ type: "text" }, data)
    forceUpdate()
  }, [true])

  const handleCancelTextFilter = useCallback(() => {
    delete filterCondition.current[filterLabel.current]
    forceUpdate()
  }, [true])

  const handleSubmitDateFilter = useCallback(data => {
    filterCondition.current[filterLabel.current] = Object.assign({ type: "date" }, data)
    forceUpdate()
  }, [true])

  const handleCancelDateFilter = useCallback(() => {
    delete filterCondition.current[filterLabel.current]
    forceUpdate()
  }, [true])

  const handleChangeRows = useCallback(select => {
    contentPage.current = 1
    contentMaxRows.current = ROWS[select]
    forceUpdate()
  }, [true])

  const handleChangePage = useCallback(page => {
    contentPage.current = page
    forceUpdate()
  }, [true])

  const handleClickCommentFilter = useCallback(() => {
    filterCondition.current["#"] = !filterCondition.current["#"]
    forceUpdate()
  }, [true])

  const handleClickComment = useCallback(data => {
    if (props.comments) {
      commentLine.current = Number(data.parent)
      if (commentLine.current === 0) {
        commentMessage.current = "File Name: " + props.name
      } else {
        commentMessage.current = props.table.format.labels.map(label => props.table.data[commentLine.current - 1][label.name]).join(", ")
      }
      comments.current = (String(commentLine.current) in props.comments) ? props.comments[String(commentLine.current)] : []
      forceUpdate()
    }
  }, [props.comments])

  const handleSubmitComment = useCallback(data => {
    if (props.onComment) {
      props.onComment({
        line    : commentLine.current,
        comment : data.text
      })
    }
  }, [props.onComment])

  const renderTitle = () => {
    try {
      return (
        <div className="text-monospace font-weight-bold text-white bg-dark py-1 px-3" title="0">
          { `${ props.name } - ${ props.table.format.title }` }
          <EmbeddedButton
            label="Comment"
            title="Add comments for this file"
            on={ "0" in props.comments }
            margin={ true }
            toggle="modal"
            target={ id.current.comment }
            onClick={ handleClickComment }
          />
        </div>
      )
    } catch {
      return (
        <div className="text-monospace font-weight-bold text-white bg-dark py-1 px-3">
          { `No Data` }
        </div>
      )
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
          <th key={ label.name } scope="col" title={ label.name }>
            { label.name }
            <EmbeddedButton
              label="Filter"
              title={ "Set/Clear filter: " + label.name }
              on={ label.name in filterCondition.current }
              margin={ true }
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
                title="Set/Clear filter: Comment"
                on={ filterCondition.current["#"] }
                onClick={ handleClickCommentFilter }
              />
            </th>
          )
        }
      }
      return <tr>{ header }</tr>
    } catch {
      return <tr><th scope="col"></th></tr>
    }
  }

  const renderBody = () => {
    try {
      contentRows.current = 0
      const format = props.table.format
      const data = props.table.data
      return data.map((datum, index) => {
        let line = index + 1
        if (!isCommentFiltered(line) || !format.labels.reduce((acc, label) => {
          return acc && isFiltered(label.name, datum[label.name])
        }, true)) { return }

        contentRows.current++
        if (contentRows.current <= (contentPage.current - 1) * contentMaxRows.current || contentRows.current > contentPage.current * contentMaxRows.current) {
          return
        }

        let row = []
        if (format.hasIndex) {
          row = [<th key={ "index" + index } className="text-right" scope="row" >{ `${ line }:` }</th>]
        }
        row = row.concat(format.labels.map(label => {
          let wrapping = (label.name === format.contentKey) ? "text-wrap text-break" : "text-nowrap"
          return <td key={ label.name + index } className={ `${ wrapping }` }>{ highlight(label.name, datum[label.name]) }</td>
        }))
        if (props.comments) {
          row.push(
            <td key={ "comment" + index } scope="col" title={ String(line) }>
              <EmbeddedButton
                label="#"
                title={ "Add comments for line: " + String(line) }
                on={ String(line) in props.comments }
                toggle="modal"
                target={ id.current.comment }
                onClick={ handleClickComment }
              />
            </td>
          )
        }
        return <tr key={ "row" + index }>{ row }</tr>
      })
    } catch {
      return []
    }
  }

  const isFiltered = (label, datum) => {
    if (!(label in filterCondition.current)) {
      return true
    }

    switch (filterCondition.current[label].type) {
      case "text":
        switch (filterCondition.current[label].mode) {
          case MODE_INCLUDED:
            if (filterCondition.current[label].case) {
              return datum.includes(filterCondition.current[label].text) ? true : false
            } else {
              return datum.toUpperCase().includes(filterCondition.current[label].text.toUpperCase()) ? true : false
            }

          case MODE_NOT_INCLUDED:
            if (filterCondition.current[label].case) {
              return !datum.includes(filterCondition.current[label].text) ? true : false
            } else {
              return !datum.toUpperCase().includes(filterCondition.current[label].text.toUpperCase()) ? true : false
            }

          case MODE_REGEX:
            const option = filterCondition.current[label].case ? "g" : "gi"
            const regex = new RegExp(filterCondition.current[label].text, option)
            return !!datum.match(regex)

          default:
            return false
        }

      case "date":
        const at = new Date(datum)
        if (at.toString() === "Invalid Date")                                                             { return false }
        if (filterCondition.current[label].enable.from && filterCondition.current[label].date.from > at)  { return false }
        if (filterCondition.current[label].enable.to   && filterCondition.current[label].date.to   < at)  { return false }
        return true

      default:
        return true
    }
  }

  const isCommentFiltered = line => {
    if (props.comments) {
      if (filterCondition.current["#"]) {
        return String(line) in props.comments ? true : false
      }
    }
    return true
  }

  const highlight = (label, datum) => {
    if (!(label in filterCondition.current)) {
      return datum
    }

    switch (filterCondition.current[label].type) {
      case "text":
        let condition = filterCondition.current[label].text
        let option = filterCondition.current[label].case ? "g" : "gi"
        switch (filterCondition.current[label].mode) {
          case MODE_INCLUDED:
            condition = escape.regex(condition)
          case MODE_REGEX:
            const regex = new RegExp(`(${ condition })`, option)
            return (
              <>
                { datum.split(regex).map((text, index) => (index % 2 === 0) ? text : <span key={ index } className="bg-warning font-weight-bold">{ text }</span>) }
              </>
            )

          default:
            return datum
        }

      default:
        return datum
    }
  }

  return (
    <div className={ props.className }>
      <Modal
        id={ id.current.text }
        title="Text Filter"
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
        title="Date Filter"
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
        formKey={ props.formKey }
        title={ `Edit/View comments, line: ${ commentLine.current } ( ${ comments.current.length } comments )` }
        message={ commentMessage.current }
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
        <div className="d-flex flex-row justify-content-center mt-2 mb-1">
          <SelectForm
            className="mx-2"
            label="rows"
            options={ ROWS }
            valid={ true }
            onChange={ handleChangeRows }
          />
          <Pagination
            className="mx-2"
            current={ contentPage.current }
            last={ Math.floor(contentRows.current / contentMaxRows.current) + 1 }
            onChange={ handleChangePage }
          />
        </div>
      </div>
    </div>
  )
})

FunctionalTable.propTypes = {
  className : PropTypes.string,
  table     : PropTypes.object,
  name      : PropTypes.string,
  user      : PropTypes.string,
  comments  : PropTypes.object,
  formKey   : PropTypes.number,
  onComment : PropTypes.func
}

FunctionalTable.defaultProps = {
  className : "",
  table     : {},
  name      : "Unnamed",
  rows      : 1000,
  user      : "anonymous",
  comments  : undefined,
  formKey   : 0,
  onComment : undefined
}

export default FunctionalTable
