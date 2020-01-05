import React from "react"
import PropTypes from "prop-types"

export default class TextForm extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {}
  }

  static get propTypes() {
    return ({
      main: PropTypes.element,
      head: PropTypes.element,
      left: PropTypes.element
    })
  }

  static get defaultProps() {
    return ({
      main: <div></div>,
      head: <div></div>,
      left: <div></div>
    })
  }

  render() {
    return (
      <div>
        <div>
          { this.props.head }
        </div>
        <div className="row overflow-hidden" style={ { height: "85%" } }>
          <div className="col-3 h-100 overflow-auto">
            { this.props.left }
          </div>
          <div className="col-9 h-100 overflow-auto">
            { this.props.main }
          </div>
        </div>
      </div>
    )
  }

}
