import React, { useState, useRef, useCallback, useReducer } from "react"
import PropTypes from "prop-types"

import axios from "axios"
import crypto from "crypto"

import MessageCard from "./message-card.js"
import UserRegisterForm from "./user-register-form.js"

import uniqueId from "../lib/uniqueId.js"

const UserRegisterBox = React.memo(props => {
  const [done,    setDone]    = useState(false)
  const [success, setSuccess] = useState(false)

  const [formId,  clearForm]  = useReducer(x => x + 1, 0)

  const message = useRef(`Register a new user. (between 4 - 16 characters with [0-9a-zA-Z])`)
  const color   = done ? (success ? "success" : "failure") : "normal"

  const handleSubmit = useCallback(data => {
    let uri = location.href
    let params = new URLSearchParams()
    params.append("username", data.username)
    params.append("password", props.encrypt ? crypto.createHash("sha256").update(data.username + data.password, "utf8").digest("hex") : data.password)

    setDone(false)
    axios.post(uri, params)
    .then(res => {
      if (!res.data.success) {
        throw new Error("registration failed")
      }
      message.current = `Succeeded to register as "${ data.username }".`
      clearForm()
      setDone(true)
      setSuccess(true)
    })
    .catch(err => {
      message.current = `Failed to register as "${ data.username }"... It might be already registered.`
      setDone(true)
      setSuccess(false)
    })
  }, [props.encrypt])

  return (
    <div className={ props.className }>
      <MessageCard
        message={ message.current }
        type={ `${ color }` }
      />
      <UserRegisterForm
        key={ formId }
        onSubmit={ handleSubmit }
      />
    </div>
  )
})

UserRegisterBox.propTypes = {
  className : PropTypes.string,
  encrypt   : PropTypes.bool,
}

UserRegisterBox.defaultProps = {
  className : "",
  encrypt   : true
}

export default UserRegisterBox
