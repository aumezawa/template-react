import React, {useRef} from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import path from "path"

import uniqueId from "../lib/uniqueId.js"

const FileForm = React.memo(React.forwardRef((props, ref) => {
  const id = useRef({
    form: uniqueId()
  })

  const handleChange = e => {
    if (props.onChange) {
      const filename = path.basename(event.target.value.replace(/\\/g, "/"))
      const fileobj  = event.target.files[0]
      props.onChange(filename, fileobj)
    }
  }

  return (
    <div className={ props.className }>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">{ props.label }</span>
        </div>
        <div className="custom-file">
          <input
            ref={ ref }
            className={ ClassNames({ "custom-file-input": true, "is-invalid": !props.valid }) }
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
}), (p, n) => {
  return p.valid === n.valid && p.label === n.label && p.disabled === n.disabled
})

FileForm.propTypes = {
  valid     : PropTypes.bool.isRequired,  // re-rendering property
  className : PropTypes.string,
  label     : PropTypes.string,
  filename  : PropTypes.string,           // re-rendering property
  disabled  : PropTypes.bool,             // re-rendering property
  onChange  : PropTypes.func
}

FileForm.defaultProps = {
  valid     : undefined,
  className : "mb-3",
  label     : "File",
  filename  : "",
  disabled  : false,
  onChange  : undefined
}

export default FileForm
