import React, {useState, useRef} from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

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

  const handleChangeUsername = text => {
    data.current.username = text
    const valid = (text.length >= props.minUserLen) && (text.length <= props.maxUserLen) && (!!text.match(/^[0-9a-zA-Z]+$/))
    setValidUser(valid)
  }

  const handleChangePassword = text => {
    data.current.password = text
    const valid = (text.length >= props.minPassLen) && (text.length <= props.maxPassLen) && (!!text.match(/^[0-9a-zA-Z]+$/))
    setValidPass(valid)
  }

  const handleSubmit = () => {
    if (props.onSubmit) {
      props.onSubmit(data.current)
    }
  }

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
        cancel=""
        disabled={ props.disabled || !validUser || !validPass }
        onSubmit={ handleSubmit }
      />
    </div>
  )
}, (p, n) => {
  return p.disabled === n.disabled
})

UserLoginForm.propTypes = {
  className : PropTypes.string,
  disabled  : PropTypes.bool,   // re-rendering property
  onSubmit  : PropTypes.func,
  minUserLen: PropTypes.number,
  maxUserLen: PropTypes.number,
  minPassLen: PropTypes.number,
  maxPassLen: PropTypes.number
}

UserLoginForm.defaultProps = {
  className : "",
  disabled  : false,
  onSubmit  : undefined,
  minUserLen: 4,
  maxUserLen: 16,
  minPassLen: 4,
  maxPassLen: 16
}

export default UserLoginForm
