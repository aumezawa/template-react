import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

export default class MessageCard extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {}
  }

  static get propTypes() {
    return ({
      message   : PropTypes.string,
      className : PropTypes.string,
      type      : PropTypes.string,
    })
  }

  static get defaultProps() {
    return ({
      message   : "No message",
      className : "",
      type      : "normal"
    })
  }

  render() {
    return (
      <div className={ this.props.className }>
        <div className="card">
          <div className={ ClassNames({
            "card-body" : true,
            "bg-light"  : this.props.type === "normal",
            "bg-success": this.props.type === "success",
            "bg-danger" : this.props.type === "failure",
          }) }>
            { this.props.message }
          </div>
        </div>
      </div>
    )
  }

}
