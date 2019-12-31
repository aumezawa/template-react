import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import uniqueId from "../lib/uniqueId.js"

export default class TreeNode extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.id = {
      node    : "node-" + uniqueId(),
      collapse: "collapse-" + uniqueId()
    }
  }

  static get propTypes() {
    return ({
      source  : PropTypes.object,
      isName  : PropTypes.func.isRequired,
      isLeaf  : PropTypes.func.isRequired,
      isChild : PropTypes.func.isRequired,
      path    : PropTypes.string,
      indent  : PropTypes.number,
      onClick : PropTypes.func
    })
  }

  static get defaultProps() {
    return ({
      source  : undefined,
      isName  : undefined,
      isLeaf  : undefined,
      isChild : undefined,
      path    : "",
      indent  : 0,
      onClick : undefined
    })
  }

  render() {
    return (
      <ul className="list-group">
        <button
          type="button"
          className="list-group-item list-group-item-action list-group-item-info rounded-0 text-left text-monospace"
          data-toggle="collapse"
          data-target={ "#" + this.id.collapse }
          aria-expanded="false"
          aria-controls={ this.id.collapse }
          onClick={ e => this.handleClickNode(e) }
        >
          { "-".repeat(this.props.indent) } { this.state.open ? "[-]" : "[+]" } { this.props.source && this.props.isName(this.props.source) }
        </button>
        <ul className="list-group collapse" id={ this.id.collapse }>
          { this.renderChildren() }
        </ul>
      </ul>
    )
  }

  renderChildren() {
    try {
      return this.props.isChild(this.props.source).map(child => {
        if (this.props.isLeaf(child)) {
          return (
            <button
              type="button"
              className="list-group-item list-group-item-action list-group-item-light rounded-0 text-left text-monospace"
              key={ this.id.node + this.props.path + "/" + this.props.isName(child) }
              title={ this.props.path + "/" + this.props.isName(this.props.source) + "/" + this.props.isName(child) }
              onClick={ e => this.handleClickLeaf(e) }
            >
              { "-".repeat(this.props.indent + 1) } { this.props.isName(child) }
            </button>
          )
        } else {
          return (
            <TreeNode
              key={ this.id.node + this.props.path + "/" + this.props.isName(child) }
              source={ child }
              isName={ this.props.isName }
              isLeaf={ this.props.isLeaf }
              isChild={ this.props.isChild }
              path={ this.props.path + "/" + this.props.isName(this.props.source) }
              indent={ this.props.indent + 1 }
              onClick={ this.props.onClick }
            />
          )
        }
      })
    } catch {
      return (
        <li
          className="list-group-item list-group-item-action list-group-item-light rounded-0 text-left text-monospace"
        >
          Invalid input data...
        </li>
      )
    }
  }

  handleClickNode(event) {
    this.setState({
      open: !this.state.open
    })
  }

  handleClickLeaf(event) {
    if (this.props.onClick) {
      this.props.onClick(event.target.title)
    }
  }
}
