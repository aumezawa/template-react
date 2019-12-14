import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

export default class Navigator extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  static get propTypes() {
    return ({
      title: PropTypes.string,
      items: PropTypes.func
    })
  }

  static get defaultProps() {
    return ({
      title: "Navigation Bar",
      items: () => this.defaultItems()
    })
  }

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark">
        <p className="navbar-brand">{ this.props.title }</p>
        <div className="dropdown">
          <button type="button" id="dropdownMenuButton" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Menu</button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={ { "zIndex": 9999 } }>
            { this.props.items() }
          </div>
        </div>
      </nav>
    )
  }

  static defaultItems() {
    return(
      <h6 className="dropdown-header">Nothing</h6>
    )
  }

}
