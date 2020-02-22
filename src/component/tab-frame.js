import React, { useRef } from "react"
import PropTypes from "prop-types"

import TabLabel from "./tab-label.js"
import TabItem from "./tab-item.js"

import uniqueId from "../lib/uniqueId.js"

const TabFrame = props => {
  const overflow = props.overflow ? "flex-basis-0 overflow-auto" : "overflow-hidden"

  const id = useRef({
    label : "label-" + uniqueId(),
    item  : "item-"  + uniqueId()
  })

  return (
    <div className={ `${ props.className } d-flex flex-column overflow-hidden h-100` }>
      <ul className="nav nav-tabs nav-justified">
        {
          props.labels.map((label, index) => (
            <TabLabel
              ref={ props.refs[index] }
              key={ index }
              label={ label }
              labelId={ id.current.label + index }
              itemId={ id.current.item + index }
              active={ index === 0 }
            />
          ))
        }
      </ul>
      <div className={ `tab-content flex-grow-1 ${ overflow }` }>
        {
          props.items.map((item, index) => (
            <TabItem
              className={ `${ props.overflow ? "" : "fit" }` }
              key={ index }
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
  className : PropTypes.string,
  labels    : PropTypes.array,
  items     : PropTypes.array,
  refs      : PropTypes.array,
  overflow  : PropTypes.bool
}

TabFrame.defaultProps = {
  className : "",
  labels    : [],
  items     : [],
  refs      : [],
  overflow  : true
}

export default TabFrame
