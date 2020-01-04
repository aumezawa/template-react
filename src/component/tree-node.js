import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import uniqueId from "../lib/uniqueId.js"

import EmbeddedButton from "./embedded-button.js"

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
    this.data = {}
  }

  static get propTypes() {
    return ({
      source  : PropTypes.object,
      isName  : PropTypes.func.isRequired,
      isLeaf  : PropTypes.func.isRequired,
      isChild : PropTypes.func.isRequired,
      labels  : PropTypes.array,
      onClick : PropTypes.func,
      path    : PropTypes.string,
      indent  : PropTypes.number
    })
  }

  static get defaultProps() {
    return ({
      source  : undefined,
      isName  : undefined,
      isLeaf  : undefined,
      isChild : undefined,
      labels  : [],
      onClick : undefined,
      path    : "",
      indent  : 0
    })
  }

  render() {
    return (
      <ul className="list-group">
        <button
          type="button"
          className="list-group-item list-group-item-action list-group-item-info rounded-0 text-left text-monospace py-2"
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
        let dirpath = this.props.path + "/" + this.props.isName(this.props.source)
        let filepath = dirpath + "/" + this.props.isName(child)
        if (this.props.isLeaf(child)) {
          return (
            <li
              className="list-group-item list-group-item-action list-group-item-light rounded-0 text-left text-monospace py-2"
              key={ this.id.node + filepath }
            >
              { "-".repeat(this.props.indent + 1) } { this.props.isName(child) }
              {
                this.props.labels.map((label, index) => {
                  return (
                    <EmbeddedButton
                      key={ this.id.node + filepath + index }
                      label={ label }
                      title={ filepath + ":" + index}
                      on={ true }
                      onClick={ e => this.handleClickLeaf(e) }
                    />
                  )
                })
              }
            </li>
          )
        } else {
          return (
            <TreeNode
              key={ this.id.node + filepath }
              source={ child }
              isName={ this.props.isName }
              isLeaf={ this.props.isLeaf }
              isChild={ this.props.isChild }
              labels={ this.props.labels }
              onClick={ this.props.onClick }
              path={ dirpath }
              indent={ this.props.indent + 1 }
            />
          )
        }
      })
    } catch {
      return (
        <li
          className="list-group-item list-group-item-action list-group-item-light rounded-0 text-left text-monospace py-2"
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
    let data = event.target.title.split(":")
    this.data.file = data[0]
    this.data.func = (data.length > 1) ? Number(data[1]) : 0
    if (this.props.onClick) {
      this.props.onClick(this.data)
    }
  }

}
