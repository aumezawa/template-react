import React, {useState, useRef} from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import ButtonSet from "./button-set.js"
import CheckForm from "./check-form.js"
import DateForm from "./date-form.js"

const TextFilterForm = React.memo(props => {
  const [enableFrom , setEnableFrom]  = useState(true)
  const [validFrom  , setValidFrom]   = useState(true)
  const [enableTo   , setEnableTo]    = useState(true)
  const [validTo    , setValidTo]     = useState(true)

  const data = useRef({
    enable: {
      from: true,
      to  : true
    },
    date: {
      from: new Date(),
      to  : new Date()
    }
  })

  const defaultDate = useRef({
    from: data.current.date.from.toISOString().slice(0, 19),
    to  : data.current.date.to.toISOString().slice(0, 19)
  })

  const isValid = key => {
    if (data.current.enable[key] && data.current.date[key].toString() === "Invalid Date") {
      return false
    }
    return true
  }

  const handleChangeCheckFrom = check => {
    data.current.enable.from = check
    setEnableFrom(check)
    setValidFrom(isValid("from"))
  }

  const handleChangeDateFrom = date => {
    data.current.date.from = date
    setValidFrom(isValid("from"))
  }

  const handleChangeCheckTo = check => {
    data.current.enable.to = check
    setEnableTo(check)
    setValidTo(isValid("to"))
  }

  const handleChangeDateTo = date => {
    data.current.date.to = date
    setValidTo(isValid("to"))
  }

  const handleSubmit = () => {
    if (props.onSubmit) {
      props.onSubmit(data.current)
    }
  }

  const handleCancel = () => {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  return (
    <div className={ props.className }>
      <div className="form-row align-items-center mb-3">
        <CheckForm
          className="col-auto"
          label="Enable"
          dafault={ enableFrom }
          disabled={ props.disabled }
          onChange={ handleChangeCheckFrom }
        />
        <DateForm
          valid={ validFrom }
          className="col"
          label="From"
          default={ defaultDate.current.from }
          disabled={ props.disabled || !enableFrom }
          onChange={ handleChangeDateFrom }
        />
      </div>
      <div className="form-row align-items-center mb-3">
        <CheckForm
          className="col-auto"
          label="Enable"
          dafault={ enableTo }
          disabled={ props.disabled }
          onChange={ handleChangeCheckTo }
        />
        <DateForm
          valid={ validTo }
          className="col"
          label="To"
          default={ defaultDate.current.to }
          disabled={ props.disabled || !enableTo }
          onChange={ handleChangeDateTo }
        />
      </div>
      <ButtonSet
        submit="Filter"
        disabled={ !validFrom || !validTo }
        onSubmit={ handleSubmit }
        onCancel={ handleCancel }
      />
    </div>
  )
}, (p, n) => {
  return p.disabled === n.disabled
})

TextFilterForm.propTypes = {
  className : PropTypes.string,
  disabled  : PropTypes.bool,   // re-rendering property
  onSubmit  : PropTypes.func
}

TextFilterForm.defaultProps = {
  className : "",
  disabled  : false,
  onSubmit  : undefined
}

export default TextFilterForm
