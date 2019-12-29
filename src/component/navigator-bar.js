import React from "react"
import PropTypes from "prop-types"

export default class NavigatorBar extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {}
  }

  static get propTypes() {
    return ({
      title: PropTypes.string,
      items: PropTypes.array
    })
  }

  static get defaultProps() {
    return ({
      title: "Navigation Bar",
      items: [<h6 className="dropdown-header" key="nothing">Nothing</h6>]
    })
  }

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark">
        <p className="navbar-brand">{ this.props.title }</p>
        <div className="dropdown">
          <button
            type="button"
            id="dropdownMenuButton"
            className="btn btn-secondary dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Menu
          </button>
          <div
            className="dropdown-menu"
            aria-labelledby="dropdownMenuButton"
            style={ { "zIndex": 9999 } }
          >
            { this.props.items }
          </div>
        </div>
      </nav>
    )
  }

}
