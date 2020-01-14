import React, {useRef} from "react"
import PropTypes from "prop-types"

import TabLabel from "./tab-label.js"
import TabItem from "./tab-item.js"

import uniqueId from "../lib/uniqueId.js"

const TabFrame = props => {
  const id = useRef({
    label : "label-" + uniqueId(),
    item  : "item-"  + uniqueId()
  })

  return (
    <div className={ props.className }>
      <ul className="nav nav-tabs nav-justified">
        {
          props.labels.map((label, index) => (
            <TabLabel
              key={ label }
              label={ label }
              labelId={ id.current.label + index }
              itemId={ id.current.item + index }
              active={ index === 0 }
            />
          ))
        }
      </ul>
      <div className="tab-content">
        {
          props.items.map((item, index) => (
            <TabItem
              key={ id.current.item + index }
              item={ item }
              labelId={ id.current.label + index }
              itemId={ id.current.item + index }
              active={ index === 0 }
            />
          ))
        }
      </div>
    </div>
  )
}

TabFrame.propTypes = {
  labels    : PropTypes.array.isRequired,
  items     : PropTypes.array.isRequired,
  className : PropTypes.string
}

TabFrame.defaultProps = {
  labels    : undefined,
  items     : undefined,
  className : ""
}

export default TabFrame
