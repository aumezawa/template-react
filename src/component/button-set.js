import React, { useCallback } from "react"
import PropTypes from "prop-types"

const ButtonSet = React.memo(props => {
  const handleSubmit = useCallback(e => {
    if (props.onSubmit) {
      props.onSubmit()
    }
  }, [props.onSubmit])

  const handleCancel = useCallback(e => {
    if (props.onCancel) {
      props.onCancel()
    }
  }, [props.onCancel])

  const display = (props.cancel === "") ? "d-none" : ""

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
        <div className={ `col-auto ${ display }` }>
          <button
            className="btn btn-secondary"
            type="button"
            data-dismiss={ props.dismiss }
            onClick={ handleCancel }
          >
            { props.cancel }
          </button>
        </div>
      </div>
    </div>
  )
})

ButtonSet.propTypes = {
  className : PropTypes.string,
  submit    : PropTypes.string,
  cancel    : PropTypes.string,
  disabled  : PropTypes.bool,
  onSubmit  : PropTypes.func,
  onCancel  : PropTypes.func
}

ButtonSet.defaultProps = {
  className : "mb-3",
  submit    : "Submit",
  cancel    : "Cancel",
  disabled  : false,
  dismiss   : "",
  onSubmit  : undefined,
  onCancel  : undefined
}

export default ButtonSet
