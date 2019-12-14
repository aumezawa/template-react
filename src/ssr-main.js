import React from "react"
import PropTypes from "prop-types"

import project from "../package.json"

export default class SsrMain extends React.Component {

  constructor(props) {
    super(props)
  }

  static get propTypes() {
    return ({
      lang    : PropTypes.string,
      project : PropTypes.string,
      desc    : PropTypes.string,
      author  : PropTypes.string,
      version : PropTypes.string,
      script  : PropTypes.string,
      page    : PropTypes.string,
      user    : PropTypes.string
    })
  }

  static get defaultProps() {
    return ({
      lang    : "ja",
      project : project.name,
      desc    : project.description,
      author  : project.author,
      version : project.version,
      script  : "/js/bundle.js",
      page    : "main",
      user    : "anonymous"
    })
  }

  render() {
    return (
      <html lang={ this.props.lang }>
        <head>
          <meta charSet="utf-8" />
          <title>{ this.props.project }</title>
          <meta name="description" content={ this.props.desc } />
          <meta name="author" content={ this.props.author } />
        </head>

        <body>
          <div className="container">
            <div id="csr-main" project={ this.props.project } page={ this.props.page } user={ this.props.user } />
          </div>
          <script src={ this.props.script }></script>
        </body>
      </html>
    )
  }

}
