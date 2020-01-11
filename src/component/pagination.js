import React from "react"
import PropTypes from "prop-types"

import range from "../lib/range.js"

export default class Pagination extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  static get propTypes() {
    return ({
      className : PropTypes.string,
      current   : PropTypes.number,
      first     : PropTypes.number,
      last      : PropTypes.number,
      range     : PropTypes.number,
      onChange  : PropTypes.func
    })
  }

  static get defaultProps() {
    return ({
      className : "",
      current   : 3,
      first     : 1,
      last      : 1,
      range     : 3,
      onChange  : undefined
    })
  }

  render() {
    return (
      <div className={ this.props.className }>
        <nav>
          <ul className="pagination justify-content-center my-0">
            <li className="page-item">
              <a className="page-link" href="#" title={ this.props.first } onClick={ e => this.handleClickPage(e) }>&laquo;</a>
            </li>
            { this.renderItem() }
            <li className="page-item">
              <a className="page-link" href="#" title={ this.props.last } onClick={ e => this.handleClickPage(e) }>&raquo;</a>
            </li>
          </ul>
        </nav>
      </div>
    )
  }

  renderItem() {
    return range(this.props.current - this.props.range, this.props.current + this.props.range).map(value => {
      if (value === this.props.current) {
        return (
          <li className="page-item active" key={ value }>
            <span className="page-link">{ value }</span>
          </li>
        )
      }
      if (value < this.props.first || value > this.props.last) {
        return (
          <li className="page-item" key={ value }>
            <span className="page-link">&middot;</span>
          </li>
        )
      }
      return (
        <li className="page-item" key={ value }>
          <a className="page-link" href="#" title={ value } onClick={ e => this.handleClickPage(e) }>{ value }</a>
        </li>
      )
    })
  }

  handleClickPage(event) {
    event.preventDefault()
    if (this.props.onChange) {
      this.props.onChange(Number(event.target.title))
    }
  }

}
