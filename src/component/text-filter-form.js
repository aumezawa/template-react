import React, { useState, useRef, useCallback } from "react"
import PropTypes from "prop-types"

import ButtonSet from "./button-set.js"
import CheckForm from "./check-form.js"
import SelectForm from "./select-form.js"
import TextForm from "./text-form.js"

const options = ["Be included", "Not be included", "Regex"]
export const MODE_INCLUDED      = 0
export const MODE_NOT_INCLUDED  = 1
export const MODE_REGEX         = 2

const TextFilterForm = React.memo(props => {
  const [valid, setValid] = useState(false)

  const refs = useRef({
    mode: React.createRef(),
    case: React.createRef(),
    text: React.createRef()
  })

  const data = useRef({
    mode: 0,
    case: true,
    text: ""
  })

  const handleChangeMode = useCallback(mode => {
    data.current.mode = mode
  }, [true])

  const handleChangeCheck = useCallback(check => {
    data.current.case = check
  }, [true])

  const handleChangeText = useCallback(text => {
    data.current.text = text
    text !== "" ? setValid(true) : setValid(false)
  }, [true])

  const handleSubmit = useCallback(() => {
    if (props.onSubmit) {
      props.onSubmit(data.current)
    }
  }, [props.onSubmit])

  const handleCancel = useCallback(() => {
    data.current.mode = refs.current.mode.current.value = 0
    data.current.case = refs.current.case.current.checked = true
    data.current.text = refs.current.text.current.value = ""
    setValid(false)
    if (props.onCancel) {
      props.onCancel()
    }
  }, [props.onCancel])

  return (
    <div className={ props.className }>
      <div className="form-row align-items-center mb-3">
        <SelectForm
          ref={ refs.current.mode }
          className="col"
          valid={ true }
          options={ options }
          label="Mode"
          disabled={ props.disabled }
          onChange={ handleChangeMode }
        />
        <CheckForm
          ref={ refs.current.case }
          className="col-auto"
          label="Case-Sensitive"
          disabled={ props.disabled }
          onChange={ handleChangeCheck }
        />
      </div>
      <TextForm
        ref={ refs.current.text }
        valid={ valid }
        label="Condition"
        disabled={ props.disabled }
        onChange={ handleChangeText }
      />
      <ButtonSet
        className=""
        submit="Filter"
        cancel="Clear"
        disabled={ !valid }
        onSubmit={ handleSubmit }
        onCancel={ handleCancel }
      />
    </div>
  )
})

TextFilterForm.propTypes = {
  className : PropTypes.string,
  disabled  : PropTypes.bool,
  onSubmit  : PropTypes.func,
  onCancel  : PropTypes.func
}

TextFilterForm.defaultProps = {
  className : "mb-3",
  disabled  : false,
  onSubmit  : undefined,
  onCancel  : undefined
}

export default TextFilterForm
