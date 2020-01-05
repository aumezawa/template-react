import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

export default class EmbeddedButton extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {}
  }

  static get propTypes() {
    return ({
      label   : PropTypes.string,
      title   : PropTypes.string,
      on      : PropTypes.bool,
      toggle  : PropTypes.string,
      target  : PropTypes.string,
      onClick : PropTypes.func,
      blank   : PropTypes.number
    })
  }

  static get defaultProps() {
    return ({
      label   : "button",
      title   : "",
      on      : false,
      toggle  : "",
      target  : "",
      onClick : undefined,
      blank   : 2
    })
  }

  render() {
    return (
      <span>
        { " ".repeat(this.props.blank) }
        <span
          className={ ClassNames({ "badge": true, "badge-btn": true, "badge-success": this.props.on, "badge-light": !this.props.on }) }
          title={ this.props.title }
          data-toggle={ this.props.toggle }
          data-target={ this.props.target }
          onClick={ e => this.handleClick(e) }
        >
          { this.props.label }
        </span>
      </span>
    )
  }

  handleClick(event) {
    if (this.props.onClick) {
      this.props.onClick(event)
    }
  }

}
