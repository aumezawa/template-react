import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

const ButtonSet = React.memo(props => {
  const handleSubmit = e => {
    if (props.onSubmit) {
      props.onSubmit()
    }
  }

  const handleCancel = e => {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  return (
    <div className={ props.className }>
      <div className="form-row justify-content-center">
        <div className="col-auto">
          <button
            className="btn btn-primary"
            type="button"
            disabled={ props.disabled }
            onClick={ handleSubmit }
          >
            { props.submit }
          </button>
        </div>
        <div className={ ClassNames({ "col-auto": true, "d-none": props.cancel === "" }) }>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={ handleCancel }
          >
            { props.cancel }
          </button>
        </div>
      </div>
    </div>
  )
}, (p, n) => {
  return p.disabled === n.disabled
})

ButtonSet.propTypes = {
  className : PropTypes.string,
  submit    : PropTypes.string,
  cancel    : PropTypes.string,
  disabled  : PropTypes.bool,   // re-rendering property
  onSubmit  : PropTypes.func,
  onCancel  : PropTypes.func
}

ButtonSet.defaultProps = {
  className : "mb-3",
  submit    : "Submit",
  cancel    : "Cancel",
  disabled  : false,
  onSubmit  : undefined,
  onCancel  : undefined
}

export default ButtonSet
