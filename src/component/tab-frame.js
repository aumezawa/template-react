import React from 'react'
import PropTypes from 'prop-types'
import ClassNames from "classnames"

import uniqueId from "../lib/uniqueId.js"

export default class TabFrame extends React.Component {

  constructor(props) {
    super(props)
    this.id = {
      tab: "tab-" + uniqueId(),
      item: "item-" + uniqueId()
    }
  }

  static get propTypes() {
    return ({
      labels: PropTypes.array.isRequired,
      items : PropTypes.array.isRequired
    })
  }

  static get defaultProps() {
    return ({
      labels: undefined,
      items : undefined
    })
  }

  render() {
    return (
      <div>
        <ul className="nav nav-tabs nav-justified">
          {
            this.props.labels.map((label, index) => {
              return (
                <li className="nav-item" key={ this.id.tab + index }>
                  <a
                    className={ ClassNames({ "nav-link": true, "active": index === 0 }) }
                    id={ this.id.tab + index }
                    key={ this.id.tab + index }
                    data-toggle="tab"
                    href={ "#" + this.id.item + index }
                    role="tab"
                    aria-controls={ this.id.item + index }
                    aria-selected="true"
                  >
                    { label }
                  </a>
                </li>
              )
            })
          }
        </ul>

        <div className="tab-content">
          {
            this.props.items.map((item, index) => {
              return (
                <div
                  className={ ClassNames({ "tab-pane": true, "fade": true, "show": index === 0, "active": index === 0 }) }
                  id={ this.id.item + index }
                  key={ this.id.tab + index }
                  role="tabpanel"
                  aria-labelledby={ this.id.tab + index }
                >
                  { item }
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }

}
