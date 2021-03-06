import React, { useCallback } from "react"
import PropTypes from "prop-types"

import range from "../lib/range.js"

const Pagination = React.memo(props => {
  const handleClick = useCallback(e => {
    e.preventDefault()
    if (props.onChange) {
      props.onChange(Number(e.target.title))
    }
  }, [props.onChange])

  const renderItem = () => {
    return range(props.current - props.range, props.current + props.range).map(value => {
      if (value === props.current) {
        return (
          <li className="page-item active" key={ value }>
            <span className="page-link">{ value }</span>
          </li>
        )
      }
      if (value < props.first || value > props.last) {
        return (
          <li className="page-item" key={ value }>
            <span className="page-link">&middot;</span>
          </li>
        )
      }
      return (
        <li className="page-item" key={ value }>
          <a className="page-link" href="#" title={ value } onClick={ handleClick }>{ value }</a>
        </li>
      )
    })
  }

  return (
    <div className={ props.className }>
      <nav>
        <ul className="pagination justify-content-center my-0">
          <li className="page-item">
            <a className="page-link" href="#" title={ props.first } onClick={ handleClick }>&laquo;</a>
          </li>
            { renderItem() }
          <li className="page-item">
            <a className="page-link" href="#" title={ props.last } onClick={ handleClick }>&raquo;</a>
          </li>
        </ul>
      </nav>
    </div>
  )
})

Pagination.propTypes = {
  className : PropTypes.string,
  current   : PropTypes.number,
  first     : PropTypes.number,
  last      : PropTypes.number,
  range     : PropTypes.number,
  onChange  : PropTypes.func
}

Pagination.defaultProps = {
  className : "",
  current   : 1,
  first     : 1,
  last      : 1,
  range     : 3,
  onChange  : undefined
}

export default Pagination
