import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import uniqueId from "../lib/uniqueId.js"

import ComplexFilterForm from "./complex-filter-form.js"
import EmbeddedButton from "./embedded-button.js"
import Modal from "./modal.js"
import Pagination from "../component/pagination.js"

export default class FiltableTable extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      page: 1
    }
    this.id = {
      modal: "modal-" + uniqueId()
    }
    this.form = {}
    this.filter = {
      conditions: {},
      label: {
        prev    : undefined,
        current : undefined
      }
    }
  }

  static get propTypes() {
    return ({
      source: PropTypes.object,
      title : PropTypes.string,
      rows  : PropTypes.number
    })
  }

  static get defaultProps() {
    return ({
      source: undefined,
      title : "",
      rows  : 5000
    })
  }

  render() {
    return (
      <div>
        <Modal
          id={ this.id.modal }
          title={ "Filter - " + this.filter.label.current }
          message="Input condition."
          body={
            <ComplexFilterForm
              ref={ ref => this.form.filter = ref }
              onSubmit={ data => this.handleSubmitFilter(data) }
              onClear={ () => this.handleClearFilter() }
            />
          }
        />
        <div className="d-flex flex-column h-100">
          { this.renderTitle() }
          <div className="table-responsive">
            <table className="table table-hover table-fixed text-monospace">
              <thead className="thead-dark">{ this.renderHeader() }</thead>
              <tbody>{ this.renderBody() }</tbody>
              <tfoot></tfoot>
            </table>
          </div>
          <Pagination
            className="mt-2"
            current={ this.state.page }
            last={ Math.floor(this.rows / this.props.rows) + 1 }
            onChange={ page => this.handleChangePage(page) }
          />
        </div>
      </div>
    )
  }

  renderTitle() {
    try {
      return <h5>{ this.props.title + " - " + this.props.source.format.title }</h5>
    } catch {
      return <h5>Untitled</h5>
    }
  }

  renderHeader() {
    try {
      const format = this.props.source.format
      let header = []
      if (format.hasHeader) {
        if (format.hasIndex) {
          header = [<th scope="col" key="index">#</th>]
        }
        header = header.concat(format.keys.map(key => {
          return (
            <th scope="col" key={ key }>
              { key }{ "  " }
              <EmbeddedButton
                label="Filter"
                title={ key }
                on={ key in this.filter.conditions }
                toggle="modal"
                target={ "#" + this.id.modal }
                onClick={ e => this.handleClickFilterButton(e) }
              />
            </th>
          )
        }))
      }
      return <tr>{ header }</tr>
    } catch {
      return <tr><th scope="col">Invalid input data...</th></tr>
    }
  }

  renderBody() {
    try {
      this.rows = 0
      const format = this.props.source.format
      const data = this.props.source.data
      return data.map((datum, index) => {
        if (!format.keys.reduce((acc, key) => {
          return acc && this.isDisplay(key, datum[key])
        }, true)) { return }

        this.rows++
        if (this.rows <= (this.state.page - 1) * this.props.rows || this.rows > this.state.page * this.props.rows) {
          return
        }

        let row = []
        if (format.hasIndex) {
          row = [<th scope="row" className="text-right" key={ "index" + index }>{ (index + 1) + ":" }</th>]
        }
        row = row.concat(format.keys.map(key => {
          return (
            <td className={ ClassNames({ "content": key === format.contentKey }) } key={ key + index }>
              { datum[key] }
            </td>
          )
        }))
        return <tr key={ "row" + index }>{ row }</tr>
      })
    } catch {
      return []
    }
  }

  isDisplay(key, datum) {
    if (Object.keys(this.filter.conditions).length === 0) {
      return true
    }

    if (!(key in this.filter.conditions)) {
      return true
    }

    switch (this.filter.conditions[key].type) {
      case ComplexFilterForm.CONST.TYPE_TEXT:
        switch (this.filter.conditions[key].mode) {
          case ComplexFilterForm.CONST.MODE_INCLUDED:
            return datum.includes(this.filter.conditions[key].condition) ? true : false
          case ComplexFilterForm.CONST.MODE_NOT_INCLUDED:
            return !datum.includes(this.filter.conditions[key].condition) ? true : false
          case ComplexFilterForm.CONST.MODE_REGEX:
            let re = new RegExp(this.filter.conditions[key].condition)
            return (re.exec(datum) !== null) ? true : false
          default:
            return false
        }

      case ComplexFilterForm.CONST.TYPE_DATE:
        let at = new Date(datum)
        if (at.toString() === "Invalid Date") {
          return false
        }
        if (this.filter.conditions[key].from.toString() !== "Invalid Date" && this.filter.conditions[key].from > at) {
          return false
        }
        if (this.filter.conditions[key].to.toString() !== "Invalid Date" && this.filter.conditions[key].to < at) {
          return false
        }
        return true

      default:
        return false
    }
  }

  handleChangePage(page) {
    this.setState({
      page: page
    })
  }

  handleClickFilterButton(event) {
    this.filter.label.prev = this.filter.label.current
    this.filter.label.current = event.target.title
    if (this.filter.label.current !== this.filter.label.prev) {
      this.form.filter.reset()
      this.forceUpdate()
    }
  }

  handleSubmitFilter(data) {
    this.filter.conditions[this.filter.label.current] = Object.assign({}, data)
    this.forceUpdate()
  }

  handleClearFilter(data) {
    delete this.filter.conditions[this.filter.label.current]
    this.form.filter.reset()
    this.forceUpdate()
  }

}
