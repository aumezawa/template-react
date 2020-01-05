import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import axios from "axios"
import path from "path"

import TreeNode from "./tree-node.js"

export default class FileExplorerBox extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      toggle: false
    }
    this.data = {}
  }

  static get propTypes() {
    return ({
      path  : PropTypes.string,
      onView: PropTypes.func
    })
  }

  static get defaultProps() {
    return ({
      path  : undefined,
      onView: undefined
    })
  }

  static get CONST() {
    return ({
      LABELS: ["view", "DL"]
    })
  }

  componentDidMount() {
    if (this.props.path) {
      this.load()
    }
  }

  render() {
    return (
      <div>
        <TreeNode
          source={ this.data.ls }
          isName={ node => node.name }
          isLeaf={ node => node.file }
          isChild={ node => node.children }
          labels={ FileExplorerBox.CONST.LABELS }
          onClick={ data => this.handleClick(data) }
        />
      </div>
    )
  }

  load() {
    const uri = location.protocol + "//" + location.host + this.props.path + "?cmd=ls"
    axios.get(uri)
    .then(res => {
      if (!res.data.success) {
        throw new Error("no directory found")
      }
      this.data.ls = res.data.ls
      this.setState({
        toggle: !this.state.toggle
      })
    })
    .catch(err => {
      this.data.ls = undefined
      alert("Could not view the directory...")
    })
  }

  handleClick(data) {
    switch (FileExplorerBox.CONST.LABELS[data.func]) {
      case "view":
        this.handleClickView(data)
        break

      case "DL":
        this.handleClickDownload(data)
        break

      default:
        break
    }
  }

  handleClickView(data) {
    const uri = location.protocol + "//" + location.host + path.join(path.dirname(this.props.path), data.file) + "?cmd=jat"

    this.data.file = path.basename(data.file)
    axios.get(uri)
    .then(res => {
      if (!res.data.success) {
        throw new Error("no file found")
      }
      this.data.table = res.data.table
      if (this.props.onView) {
        this.props.onView(this.data)
      }
    })
    .catch(err => {
      this.data.table = undefined
      alert("Could not view the file...")
    })
  }

  handleClickDownload(data) {
    const uri = location.protocol + "//" + location.host + path.join(path.dirname(this.props.path), data.file)
    axios.get(uri, {
      responseType: "blob"
    })
    .then(res => {
      const link = document.createElement("a")
      link.href = URL.createObjectURL(new Blob([res.data]))
      link.setAttribute("download", path.basename(data.file))
      document.body.appendChild(link)
      link.click()
    })
    .catch(err => {
      alert("Could not download the file...")
    })
  }

}
