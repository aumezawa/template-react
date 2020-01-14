import React, {useState, useRef} from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

import axios from "axios"
import crypto from "crypto"

import MessageCard from "./message-card.js"
import UserRegisterForm from "./user-register-form.js"

import uniqueId from "../lib/uniqueId.js"

const UserRegisterBox = React.memo(props => {
  const [done,    setDone]    = useState(false)
  const [success, setSuccess] = useState(false)

  const id = useRef({
    form: uniqueId()
  })

  const message = useRef(`Register a new user. (between 4 - 16 characters with [0-9a-zA-Z])`)

  const handleSubmit = data => {
    let uri = location.href
    let params = new URLSearchParams()
    params.append("username", data.username)
    params.append("password", crypto.createHash("sha256").update(data.username + data.password, "utf8").digest("hex"))

    setDone(false)
    axios.post(uri, params)
    .then(res => {
      if (!res.data.success) {
        throw new Error("registration failed")
      }
      message.current = `Succeeded to register as "${ data.username }".`
      id.current.form = uniqueId() // to reset form
      setDone(true)
      setSuccess(true)
    })
    .catch(err => {
      message.current = `Failed to register as "${ data.username }"... It might be already registered.`
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
      <UserRegisterForm
        key={ id.current.form }
        onSubmit={ handleSubmit }
      />
    </div>
  )
}, (p, n) => true)

UserRegisterBox.propTypes = {
  className   : PropTypes.string
}

UserRegisterBox.defaultProps = {
  className   : ""
}

export default UserRegisterBox
