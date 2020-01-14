import React, {useState, useRef} from "react"
import PropTypes from "prop-types"

import ButtonSet from "./button-set.js"
import SelectForm from "./select-form.js"
import TextForm from "./text-form.js"

const options = ["Be included", "Not be included", "Regex"]
export const MODE_INCLUDED      = 0
export const MODE_NOT_INCLUDED  = 1
export const MODE_REGEX         = 2

const TextFilterForm = React.memo(props => {
  const [valid, setValid] = useState(false)

  const refs = useRef({
    select: React.createRef(),
    text  : React.createRef()
  })

  const data = useRef({
    mode: 0,
    text: ""
  })

  const handleChangeMode = mode => {
    data.current.mode = mode
  }

  const handleChangeText = text => {
    data.current.text = text
    text !== "" ? setValid(true) : setValid(false)
  }

  const handleSubmit = () => {
    if (props.onSubmit) {
      props.onSubmit(data.current)
    }
  }

  const handleCancel = () => {
    console.log(refs)
    data.current.mode = refs.current.select.current.value = 0
    data.current.text = refs.current.text.current.value   = ""
    setValid(false)
    if (props.onCancel) {
      props.onCancel()
    }
  }

  return (
    <div className={ props.className }>
      <SelectForm
        ref={ refs.current.select }
        valid={ true }
        options={ options }
        label="Mode"
        disabled={ props.disabled }
        onChange={ handleChangeMode }
      />
      <TextForm
        ref={ refs.current.text }
        valid={ valid }
        label="Condition"
        disabled={ props.disabled }
        onChange={ handleChangeText }
      />
      <ButtonSet
        submit="Filter"
        cancel="Clear"
        disabled={ !valid }
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
  onSubmit  : PropTypes.func,
  onCancel  : PropTypes.func
}

TextFilterForm.defaultProps = {
  className : "",
  disabled  : false,
  onSubmit  : undefined,
  onCancel  : undefined
}

export default TextFilterForm
