import React, { useState, useRef, useCallback } from "react"
import PropTypes from "prop-types"

import ButtonSet from "./button-set.js"
import TextForm from "./text-form.js"

const UserRegisterForm = React.memo(props => {
  const [validUser, setValidUser] = useState(false)
  const [validPass, setValidPass] = useState(false)
  const [validConf, setValidConf] = useState(false)

  const refs = useRef({
    username: React.createRef(),
    password: React.createRef(),
    confirm : React.createRef()
  })

  const data = useRef({
    username: "",
    password: "",
    confirm : ""
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
    setValidConf(data.current.password === data.current.confirm)
  }, [props.allowPass])

  const handleChangeConfirm = useCallback(text => {
    data.current.confirm = text
    const valid = (!!text.match(props.allowPass)) && (data.current.password === data.current.confirm)
    setValidConf(valid)
  }, [props.allowPass])

  const handleSubmit = useCallback(() => {
    if (props.onSubmit) {
      props.onSubmit(data.current)
    }
  }, [props.onSubmit])

  const handleCancel = useCallback(() => {
    data.current.username = refs.current.username.current.value = ""
    data.current.password = refs.current.password.current.value = ""
    data.current.confirm  = refs.current.confirm.current.value  = ""
    setValidUser(false)
    setValidPass(false)
    setValidConf(false)
  }, [true])

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
      <TextForm
        ref={ refs.current.confirm }
        valid={ validConf }
        label="confirm"
        type="password"
        disabled={ props.disabled }
        onChange={ handleChangeConfirm }
      />
      <ButtonSet
        submit="Register"
        cancel="Clear"
        disabled={ props.disabled || !validUser || !validPass || !validConf }
        onSubmit={ handleSubmit }
        onCancel={ handleCancel }
      />
    </div>
  )
})

UserRegisterForm.propTypes = {
  className : PropTypes.string,
  disabled  : PropTypes.bool,
  onSubmit  : PropTypes.func,
  allowUser : PropTypes.object,
  allowPass : PropTypes.object
}

UserRegisterForm.defaultProps = {
  className : "",
  disabled  : false,
  onSubmit  : undefined,
  allowUser : /^[0-9a-zA-Z]{4,16}$/,
  allowPass : /^[0-9a-zA-Z]{4,16}$/
}

export default UserRegisterForm
