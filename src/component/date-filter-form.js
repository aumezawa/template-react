import React, { useState, useRef, useCallback } from "react"
import PropTypes from "prop-types"

import ButtonSet from "./button-set.js"
import CheckForm from "./check-form.js"
import DateForm from "./date-form.js"

import LocalDate from "../lib/date.js"

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
      from: LocalDate(9),
      to  : LocalDate(9)
    }
  })

  const defaultDate = useRef({
    from: data.current.date.from.toISOString().slice(0, 19),
    to  : data.current.date.to.toISOString().slice(0, 19)
  })

  const isValid = key => (!data.current.enable[key] || data.current.date[key].toString() !== "Invalid Date") ? true : false

  const handleChangeCheckFrom = useCallback(check => {
    data.current.enable.from = check
    setEnableFrom(check)
    setValidFrom(isValid("from"))
  }, [true])

  const handleChangeDateFrom = useCallback(date => {
    data.current.date.from = date
    setValidFrom(isValid("from"))
  }, [true])

  const handleChangeCheckTo = useCallback(check => {
    data.current.enable.to = check
    setEnableTo(check)
    setValidTo(isValid("to"))
  }, [true])

  const handleChangeDateTo = useCallback(date => {
    data.current.date.to = date
    setValidTo(isValid("to"))
  }, [true])

  const handleSubmit = useCallback(() => {
    if (props.onSubmit) {
      props.onSubmit(data.current)
    }
  }, [props.onSubmit])

  const handleCancel = useCallback(() => {
    if (props.onCancel) {
      props.onCancel()
    }
  }, [props.onCancel])

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
        className=""
        submit="Filter"
        cancel="Clear"
        disabled={ !validFrom || !validTo }
        onSubmit={ handleSubmit }
        onCancel={ handleCancel }
      />
    </div>
  )
})

TextFilterForm.propTypes = {
  className : PropTypes.string,
  disabled  : PropTypes.bool,
  onSubmit  : PropTypes.func
}

TextFilterForm.defaultProps = {
  className : "mb-3",
  disabled  : false,
  onSubmit  : undefined
}

export default TextFilterForm
