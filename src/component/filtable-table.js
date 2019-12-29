import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import uniqueId from "../lib/uniqueId.js"

import ComplexFilterForm from "./complex-filter-form.js"
import Modal from "./modal.js"

export default class Table extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      toggle: false
    }
    this.id = {
      modal: "modal-" + uniqueId()
    }
    this.filter = {}
  }

  static get propTypes() {
    return ({
      source: PropTypes.object.isRequired,
      small : PropTypes.bool,
      height: PropTypes.string,
    })
  }

  static get defaultProps() {
    return ({
      source: undefined,
      small : false,
      height: "80%",
    })
  }

  render() {
    return (
      <div>
        <Modal
          id={ this.id.modal }
          title="Filter"
          message="Input condition."
          body={ () =>
            <ComplexFilterForm
              onSubmit={ data => this.handleSubmitFilter(data) }
              onClear={ () => this.handleClearFilter() }
            />
          }
        />
        { this.renderTitle() }
        <div className="table-responsive" style={ { height: this.props.height } }>
          <table className={ ClassNames({ "table": true, "table-fixed": true, "table-hover": true, "table-sm": this.props.small }) }>
            <thead>{ this.renderHeader() }</thead>
            <tbody>{ this.renderBody() }</tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </div>
    )
  }

  renderTitle() {
    let title
    try {
      const format = this.props.source.format
      title = this.props.source.format.title
    } catch {
      title = "Untitled"
    }
    return <h5>{ title }</h5>
  }

  renderHeader() {
    let header

    try {
      const format = this.props.source.format
      header = []
      if (format.hasHeader) {
        if (format.hasIndex) {
          header = [<th scope="col" className="table-dark text-monospace" key="idx">#</th>]
        }
        header = header.concat(format.keys.map(key => {
          return (
            <th scope="col" className="table-dark text-monospace" key={ key }>
              { key }{ "  " }
              <span
                className={ ClassNames({ "badge": true, "badge-light": !(key in this.filter), "badge-success": (key in this.filter) }) }
                key={ key }
                title={ key }
                data-toggle="modal"
                data-target={ "#" + this.id.modal }
                onClick={ e => this.handleClickFilter(e) }
              >
                Filter
              </span>
            </th>
          )
        }))
      }
    } catch {
      header = <th scope="col" className="table-dark text-monospace">Invalid input data...</th>
    }

    return <tr>{ header }</tr>
  }

  renderBody() {
    let body

    try {
      const format = this.props.source.format
      const data = this.props.source.data
      body = data.map((datum, index) => {
        let line = []
        let display = format.keys.reduce((acc, key) => {
          return acc && this.isDisplay(key, datum[key])
        }, true)
        if (format.hasIndex) {
          line = [<th scope="row" className="text-right text-monospace" key={ "idx" + index }>{ (index + 1) + ":" }</th>]
        }
        line = line.concat(format.keys.map(key => {
          return (
            <td
              scope="row"
              className={ ClassNames({ "text-monospace": true, "content": key === format.contentKey }) }
              key={ key + index }
            >
              { datum[key] }
            </td>
          )
        }))
        return <tr className={ ClassNames({ "d-none": !display }) } key={ index }>{ line }</tr>
      })
    } catch {
      body = []
    }

    return body
  }

  isDisplay(key, datum) {
    if (Object.keys(this.filter).length === 0) {
      return true
    }

    if (!(key in this.filter)) {
      return true
    }

    switch (this.filter[key].type) {
      case ComplexFilterForm.CONST.TYPE_TEXT:
        switch (this.filter[key].mode) {
          case ComplexFilterForm.CONST.MODE_INCLUDED:
            return datum.includes(this.filter[key].condition) ? true : false
          case ComplexFilterForm.CONST.MODE_NOT_INCLUDED:
            return !datum.includes(this.filter[key].condition) ? true : false
          case ComplexFilterForm.CONST.MODE_REGEX:
            let re = new RegExp(this.filter[key].condition)
            return (re.exec(datum) !== null) ? true : false
          default:
            return false
        }

      case ComplexFilterForm.CONST.TYPE_DATE:
        let at = new Date(datum)
        if (at.toString() === "Invalid Date") {
          return false
        }
        if (this.filter[key].from.toString() !== "Invalid Date" && this.filter[key].from > at) {
          return false
        }
        if (this.filter[key].to.toString() !== "Invalid Date" && this.filter[key].to < at) {
          return false
        }
        return true

      default:
        return false
    }
  }

  handleClickFilter(event) {
    this.filterLabel = event.target.title
  }

  handleSubmitFilter(data) {
    this.filter[this.filterLabel] = Object.assign({}, data)
    this.setState({
      toggle: !this.state.toggle
    })
  }

  handleClearFilter(data) {
    delete this.filter[this.filterLabel]
    this.setState({
      toggle: !this.state.toggle
    })
  }

}