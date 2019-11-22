import React from "react"
import ReactDOM from "react-dom"
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default class CsrMain extends React.Component {

  constructor(props) {
    super(props)
  }

  static get propTypes() {
    return (
      {
      }
    )
  }

  static get defaultProps() {
    return (
      {
      }
    )
  }

  render() {
    return (
      <div className="text-center">
        This is the main component!
      </div>
    )
  }

}

ReactDOM.render(<CsrMain />, document.getElementById("csr-main"))
