import React from "react"
import PropTypes from "prop-types"

import uniqueId from "../lib/uniqueId.js"

export default class Modal extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {}
    this.id = {
      label: uniqueId()
    }
  }

  static get propTypes() {
    return ({
      id        : PropTypes.string.isRequired,
      title     : PropTypes.string,
      message   : PropTypes.string,
      body      : PropTypes.func,
      closeFunc : PropTypes.func
    })
  }

  static get defaultProps() {
    return ({
      id        : undefined,
      title     : "Title",
      message   : "Hello.",
      body      : () => this.defaultBody(),
      closeFunc : undefined
    })
  }

  render() {
    return (
      <div className="modal fade" id={ this.props.id } tabIndex="-1" role="dialog" aria-labelledby={ this.id.label } aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={ this.id.label }>{ this.props.title }</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={ () => this.hidden() }>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="text-left">{ this.props.message }</div>
              <br />
              { this.props.body() }
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={ () => this.hidden() }>Close</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  hidden() {
    if (this.props.closeFunc) {
      this.props.closeFunc()
    }
  }

  static defaultBody() {
    return(
      <div>Nothing to do...</div>
    )
  }

}
