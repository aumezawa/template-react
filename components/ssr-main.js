import React from "react"
import PropTypes from "prop-types"

export default class SsrMain extends React.Component {

  constructor(props) {
    super(props)
  }

  static get propTypes() {
    return ({
      lang    : PropTypes.string,
      title   : PropTypes.string,
      desc    : PropTypes.string,
      author  : PropTypes.string,
      script  : PropTypes.string,
      id      : PropTypes.string
    })
  }

  static get defaultProps() {
    return ({
      lang    : "ja",
      title   : "template-react",
      desc    : "Template of a project with react",
      author  : "aume",
      script  : "/js/bundle.js",
      id      : "csr-main"
    })
  }

  render() {
    return (
      <html lang={ this.props.lang }>
        <head>
          <meta charSet="utf-8" />
          <title>{ this.props.title }</title>
          <meta name="description" content={ this.props.desc } />
          <meta name="author" content={ this.props.author } />
        </head>

        <body>
          <div className="container">
            <div id={ this.props.id } />
          </div>
          <script src={ this.props.script }></script>
        </body>
      </html>
    )
  }

}
