import React from "react"
import PropTypes from "prop-types"

const MessageCard = React.memo(props => {
  let color = ""
  switch (props.type) {
    case "normal" :
      color = "bg-light"
      break
    case "success":
      color = "bg-success"
      break
    case "failure":
      color = "bg-danger"
      break
    default:
      break
  }

  return (
    <div className={ props.className }>
      <div className="card">
        <div className={ `card-body ${ color }` }>
          { props.message }
        </div>
      </div>
    </div>
  )
})

MessageCard.propTypes = {
  className : PropTypes.string,
  message   : PropTypes.string,
  type      : PropTypes.string
}

MessageCard.defaultProps = {
  className : "my-3",
  message   : "No message",
  type      : "normal"
}

export default MessageCard
