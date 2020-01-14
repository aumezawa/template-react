import React, {useState, useRef} from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import axios from "axios"
import crypto from "crypto"

import MessageCard from "./message-card.js"
import UserLoginForm from "./user-login-form.js"

const UserLoginBox = React.memo(props => {
  const [done,    setDone]    = useState(false)
  const [success, setSuccess] = useState(false)

  const message = useRef(`Please input your "username" and "password". (between 4 - 16 characters with [0-9a-zA-Z])`)

  const handleSubmit = data => {
    let uri = location.href
    let params = new URLSearchParams()
    params.append("username", data.username)
    params.append("password", crypto.createHash("sha256").update(data.username + data.password, "utf8").digest("hex"))

    setDone(false)
    axios.post(uri, params)
    .then(res => {
      if (!res.data.success) {
        throw new Error("login failed")
      }
      message.current = `Succeeded to login as "${ data.username }". Will redirect automatically in ${ props.redirectSec } sec.`
      setDone(true)
      setSuccess(true)
      setTimeout(() => location.pathname = res.data.path, props.redirectSec * 1000)
    })
    .catch(err => {
      message.current = `Failed to login as "${ data.username }"...`
      setDone(true)
      setSuccess(false)
    })
  }

  return (
    <div className={ props.className }>
      <MessageCard
        message={ message.current }
        type={ done ? (success ? "success" : "failure") : "normal" }
      />
      <UserLoginForm
        disabled={ success }
        onSubmit={ handleSubmit }
      />
    </div>
  )
}, (p, n) => true)

UserLoginBox.propTypes = {
  className   : PropTypes.string,
  redirectSec : PropTypes.number
}

UserLoginBox.defaultProps = {
  className   : "",
  redirectSec : 3
}

export default UserLoginBox
