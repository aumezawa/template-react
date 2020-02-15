import React, { useRef, useCallback } from "react"
import PropTypes from "prop-types"

import path from "path"

import uniqueId from "../lib/uniqueId.js"

const FileForm = React.memo(React.forwardRef((props, ref) => {
  const valid   = (props.valid) ? "" : "is-invalid"
  const display = (props.hidden) ? "d-none" : ""

  const id = useRef({
    form: uniqueId()
  })

  const handleChange = useCallback(e => {
    if (props.onChange) {
      props.onChange({
        name: path.basename(event.target.value.replace(/\\/g, "/")),
        obj : event.target.files[0]
      })
    }
  }, [props.onChange])

  return (
    <div className={ `${ props.className} ${ display }` }>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">{ props.label }</span>
        </div>
        <div className="custom-file">
          <input
            ref={ ref }
            className={ `custom-file-input ${ valid }` }
            type="file"
            id={ id.current.form }
            disabled={ props.disabled }
            onChange={ handleChange }
          />
          <label className="custom-file-label" htmlFor={ id.current.form }>{ props.filename }</label>
        </div>
      </div>
    </div>
  )
}))

FileForm.propTypes = {
  valid     : PropTypes.bool.isRequired,
  className : PropTypes.string,
  label     : PropTypes.string,
  filename  : PropTypes.string,
  disabled  : PropTypes.bool,
  hidden    : PropTypes.bool,
  onChange  : PropTypes.func
}

FileForm.defaultProps = {
  valid     : undefined,
  className : "mb-3",
  label     : "File",
  filename  : "",
  disabled  : false,
  hidden    : false,
  onChange  : undefined
}

export default FileForm
