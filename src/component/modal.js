import React, { useRef, useCallback } from "react"
import PropTypes from "prop-types"

import uniqueId from "../lib/uniqueId.js"

const Modal = props => {
  const display = (props.message === "") ? "d-none" : ""

  const id = useRef({
    label: uniqueId()
  })

  return (
    <div className="modal fade" id={ props.id } tabIndex="-1" role="dialog" aria-labelledby={ id.current.label } aria-hidden="true">
      <div className={ `modal-dialog modal-dialog-centered modal-dialog-scrollable ${ props.size }` } role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={ id.current.label }>{ props.title }</h5>
            <p className={ `${ display }` }>{ props.message }</p>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            { props.body }
          </div>
          <div className="modal-footer">
            { props.footer }
          </div>
        </div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  id      : PropTypes.string.isRequired,
  title   : PropTypes.string,
  message : PropTypes.string,
  size    : PropTypes.string,
  body    : PropTypes.element,
  button  : PropTypes.element
}

Modal.defaultProps = {
  id      : undefined,
  title   : "Title",
  message : "",
  size    : "",
  body    : <>Nothing to do...</>,
  footer  : <button className="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
}

export default Modal
