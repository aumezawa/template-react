import React from "react"
import PropTypes from "prop-types"

import project from "../package.json"

const SsrMain = React.memo(props => (
  <html lang={ props.lang }>
    <head>
      <meta charSet="utf-8" />
      <title>{ props.project }</title>
      <meta name="description" content={ props.desc } />
      <meta name="author" content={ props.author } />
    </head>

    <body>
      <div id="csr-main" project={ props.project } page={ props.page } user={ props.user } />
      <script src={ props.script }></script>
    </body>
  </html>
), (p, n) => true)

SsrMain.propTypes = {
  lang    : PropTypes.string,
  project : PropTypes.string,
  desc    : PropTypes.string,
  author  : PropTypes.string,
  version : PropTypes.string,
  script  : PropTypes.string,
  page    : PropTypes.string,
  user    : PropTypes.string
}

SsrMain.defaultProps = {
  lang    : "ja",
  project : project.name,
  desc    : project.description,
  author  : project.author,
  version : project.version,
  script  : "/js/bundle.js",
  page    : "main",
  user    : "anonymous"
}

export default SsrMain
