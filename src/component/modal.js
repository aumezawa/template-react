import React, {useRef} from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import uniqueId from "../lib/uniqueId.js"

const Modal = React.memo(props => {
  const id = useRef({
    label: uniqueId()
  })

  const handleClose = e => {
    if (props.onClose){
      props.onClose()
    }
  }

  return (
    <div className="modal fade" id={ props.id } tabIndex="-1" role="dialog" aria-labelledby={ id.current.label } aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={ id.current.label }>{ props.title }</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close" onClick={ handleClose }>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className={ ClassNames({ "d-none": props.message === ""  }) }>
              <div className="text-left">{ props.message }</div>
              <br  />
            </div>
            { props.body }
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" type="button" data-dismiss="modal" onClick={ handleClose }>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}, (p, n) => {
  return p.title === n.title && p.message === n.message
})

Modal.propTypes = {
  id      : PropTypes.string.isRequired,
  title   : PropTypes.string,             // re-rendering property
  message : PropTypes.string,             // re-rendering property
  body    : PropTypes.element,
  onClose : PropTypes.func
}

Modal.defaultProps = {
  id      : undefined,
  title   : "Title",
  message : "",
  body    : <>Nothing to do...</>,
  onClose : undefined
}

export default Modal
