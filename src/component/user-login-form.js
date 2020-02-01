import React, { useState, useRef, useCallback } from "react"
import PropTypes from "prop-types"

import ButtonSet from "./button-set.js"
import TextForm from "./text-form.js"

const UserLoginForm = React.memo(props => {
  const [validUser, setValidUser] = useState(false)
  const [validPass, setValidPass] = useState(false)

  const refs = useRef({
    username: React.createRef(),
    password: React.createRef()
  })

  const data = useRef({
    username: "",
    password: ""
  })

  const handleChangeUsername = useCallback(text => {
    data.current.username = text
    const valid = (!!text.match(props.allowUser))
    setValidUser(valid)
  }, [props.allowUser])

  const handleChangePassword = useCallback(text => {
    data.current.password = text
    const valid = (!!text.match(props.allowPass))
    setValidPass(valid)
  }, [props.allowPass])

  const handleSubmit = useCallback(() => {
    if (props.onSubmit) {
      props.onSubmit(data.current)
    }
  }, [props.onSubmit])

  const handleCancel = useCallback(() => {
    data.current.username = refs.current.username.current.value = ""
    data.current.password = refs.current.password.current.value = ""
    setValidUser(false)
    setValidPass(false)
  }, [props.onCancel])

  return (
    <div className={ props.className }>
      <TextForm
        ref={ refs.current.username }
        valid={ validUser }
        label="username"
        disabled={ props.disabled }
        onChange={ handleChangeUsername }
      />
      <TextForm
        ref={ refs.current.password }
        valid={ validPass }
        label="password"
        type="password"
        disabled={ props.disabled }
        onChange={ handleChangePassword }
      />
      <ButtonSet
        submit="Login"
        cancel="Clear"
        disabled={ props.disabled || !validUser || !validPass }
        onSubmit={ handleSubmit }
        onCancel={ handleCancel }
      />
    </div>
  )
})

UserLoginForm.propTypes = {
  className : PropTypes.string,
  disabled  : PropTypes.bool,
  onSubmit  : PropTypes.func,
  allowUser : PropTypes.object,
  allowPass : PropTypes.object
}

UserLoginForm.defaultProps = {
  className : "",
  disabled  : false,
  onSubmit  : undefined,
  allowUser : /^[0-9a-zA-Z]{4,16}$/,
  allowPass : /^[0-9a-zA-Z]{4,16}$/
}

export default UserLoginForm
