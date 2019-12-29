import React from "react"
import PropTypes from "prop-types"

export default class NavigatorItem extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {}
  }

  static get propTypes() {
    return ({
      label   : PropTypes.string,
      page    : PropTypes.string,
      disabled: PropTypes.bool
    })
  }

  static get defaultProps() {
    return ({
      label   : "Top page",
      page    : "/",
      disabled: false
    })
  }

  render() {
    return (
      <button
        type="button"
        className="dropdown-item"
        disabled={ this.props.disabled }
        onClick={ () => location.href = this.props.page }
      >
        { this.props.label }
      </button>
    )
  }

}
