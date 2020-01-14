import React from "react"
import PropTypes from "prop-types"

const CheckForm = React.memo(props => {
  const handleChange = e => {
    if (props.onChange) {
      props.onChange(e.target.checked)
    }
  }

  return (
    <div className={ props.className }>
      <div className="input-group">
        <div className="input-group-prepend">
          <div className="input-group-text">
            <input type="checkbox" defaultChecked={props.dafault} onChange={ handleChange } />
          </div>
        </div>
        <div className="input-group-append">
          <span className="input-group-text">{ props.label }</span>
        </div>
      </div>
    </div>
  )
}, (p, n) => {
  return p.disabled === n.disabled
})

CheckForm.propTypes = {
  className : PropTypes.string,
  label     : PropTypes.string,
  dafault   : PropTypes.bool,
  disabled  : PropTypes.bool,   // re-rendering property
  onChange  : PropTypes.func
}

CheckForm.defaultProps = {
  className : "mb-3",
  label     : "Check",
  dafault   : true,
  disabled  : false,
  onChange  : undefined
}

export default CheckForm
