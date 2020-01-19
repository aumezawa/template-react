import React, { useState, useRef, useCallback } from "react"
import PropTypes from "prop-types"

import ButtonSet from "./button-set.js"
import TextboxForm from "./textbox-form.js"

const CommentForm = React.memo(props => {
  const [valid, setValid] = useState(false)

  const refs = useRef({
    text: React.createRef()
  })

  const data = useRef({
    text: ""
  })

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
    data.current.text = refs.current.text.current.value = ""
    setValid(false)
  }, [true])

  return (
    <div className={ props.className }>
      <TextboxForm
        ref={ refs.current.text }
        valid={ valid }
        label="#"
        rows={ 5 }
        maxLength={ props.maxLength }
        placeholder={ `Input your comments. Maximum comment size is ${ props.maxLength } byte.` }
        disabled={ props.disabled }
        onChange={ handleChangeText }
      />
      <ButtonSet
        submit={ props.submit }
        cancel={ props.cancel }
        disabled={ !valid }
        dismiss={ props.dismiss }
        onSubmit={ handleSubmit }
        onCancel={ handleCancel }
      />
    </div>
  )
})

CommentForm.propTypes = {
  className : PropTypes.string,
  submit    : PropTypes.string,
  cancel    : PropTypes.string,
  maxLength : PropTypes.number,
  disabled  : PropTypes.bool,
  onSubmit  : PropTypes.func
}

CommentForm.defaultProps = {
  className : "",
  submit    : "Submit",
  cancel    : "Clear",
  maxLength : 1024,
  disabled  : false,
  dismiss   : "",
  onSubmit  : undefined
}

export default CommentForm
