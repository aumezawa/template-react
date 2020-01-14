import React, {useState, useEffect, useRef, useReducer} from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import DateFilterForm from "./date-filter-form.js"
import EmbeddedButton from "./embedded-button.js"
import Modal from "./modal.js"
import Pagination from "../component/pagination.js"
import TextFilterForm, {MODE_INCLUDED, MODE_NOT_INCLUDED, MODE_REGEX} from "./text-filter-form.js"

import uniqueId from "../lib/uniqueId.js"

const FunctionalTable = React.memo(props => {
  const [page, setPage] = useState(1)

  const [ignored, forceUpdate] = useReducer(x => x + 1, 0)

  const rows = useRef(0)

  const filter = useRef({})

  const label = useRef(undefined)

  const id = useRef({
    text: "modal-" + uniqueId(),
    date: "modal-" + uniqueId()
  })

  useEffect(() => {
    filter.current = {}
    forceUpdate()
  }, [props.source])

  const handleClickFilter = e => {
    label.current = e.target.title
  }

  const handleSubmitTextFilter = data => {
    filter.current[label.current] = Object.assign({ type: "text" }, data)
    forceUpdate()
  }

  const handleCancelTextFilter = () => {
    delete filter.current[label.current]
    forceUpdate()
  }

  const handleSubmitDateFilter = data => {
    filter.current[label.current] = Object.assign({ type: "date" }, data)
    forceUpdate()
  }

  const handleCancelDateFilter = data => {
    delete filter.current[label.current]
    forceUpdate()
  }

  const handleChangePage = page => {
    setPage(page)
  }

  const renderTitle = () => {
    try {
      return <h5>{ `${ props.title } - ${ props.source.format.title }` }</h5>
    } catch {
      return <h5>{ `${ props.title } - Untitled` }</h5>
    }
  }

  const renderHeader = () => {
    try {
      const format = props.source.format
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
      }
      return <tr>{ header }</tr>
    } catch {
      return <tr><th scope="col">Invalid input data...</th></tr>
    }
  }

  const renderBody = () => {
    try {
      rows.current = 0
      const format = props.source.format
      const data = props.source.data
      return data.map((datum, index) => {
        if (!format.labels.reduce((acc, label) => {
          return acc && isDisplay(label.name, datum[label.name])
        }, true)) { return }

        rows.current++
        if (rows.current <= (page - 1) * props.rows || rows.current > page * props.rows) {
          return
        }

        let row = []
        if (format.hasIndex) {
          row = [<th key={ "index" + index } className="text-right" scope="row" >{ `${ index + 1 }:` }</th>]
        }
        row = row.concat(format.labels.map(label => (
          <td key={ label.name + index }>{ datum[label.name] }</td>
        )))
        return <tr key={ "row" + index }>{ row }</tr>
      })
    } catch {
      return []
    }
  }

  const isDisplay = (key, datum) => {
    if (Object.keys(filter.current).length === 0) { return true }
    if (!(key in filter.current))                 { return true }

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

  return (
    <div className={ props.className }>
      <Modal
        id={ id.current.text }
        title="Filter text"
        body={
          <TextFilterForm
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
            onSubmit={ handleSubmitDateFilter }
            onCancel={ handleCancelDateFilter }
          />
        }
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
}, (p, n) => {
  return p.source === n.source
})

FunctionalTable.propTypes = {
  source: PropTypes.object,   // re-rendering property
  title : PropTypes.string,
  rows  : PropTypes.number
}

FunctionalTable.defaultProps = {
  source: undefined,
  title : "",
  rows  : 5000
}

export default FunctionalTable
