import React from "react"
import PropTypes from "prop-types"

export default class AutoReloader extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      count: this.props.interval
    }
  }

  static get propTypes() {
    return (
      {
        interval: PropTypes.number.isRequired
      }
    )
  }

  static get defaultProps() {
    return (
      {
        interval: 0
      }
    )
  }

  // client only
  componentDidMount() {
    if (this.state.count > 1) {
      this.timer = setTimeout(() => this.countdown(), 1000)
    }
  }

  // client only
  componentDidUpdate() {
    if (this.state.count > 1) {
      this.timer = setTimeout(() => this.countdown(), 1000)
    } else {
      this.timer = setTimeout(() => location.reload(), 1000)
    }
  }

  // client only
  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    return (
      <div>
        <p>This page will be automatically reload after {this.state.count} seconds.</p>
        <button type="button" className="btn btn-primary" onClick={e => this.reload()}>Reload</button>
        <button type="button" className="btn btn-secondary" onClick={e => this.stop()}>Stop</button>
      </div>
    )
  }

  countdown() {
    this.setState({
      count: this.state.count - 1
    })
  }

  reload() {
    clearTimeout(this.timer)
    location.reload()
  }

  stop() {
    clearTimeout(this.timer)
  }

}
