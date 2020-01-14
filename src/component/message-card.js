import React from "react"
import PropTypes from "prop-types"
import ClassNames from "classnames"

const MessageCard = React.memo(props => {
  return (
    <div className={ props.className }>
      <div className="card">
        <div className={ ClassNames({
          "card-body" : true,
          "bg-light"  : props.type === "normal",
          "bg-success": props.type === "success",
          "bg-danger" : props.type === "failure",
        }) }>
          { props.message }
        </div>
      </div>
    </div>
  )
}, (p, n) => {
  return p.message === n.message && p.type === n.type
})

MessageCard.propTypes = {
  className : PropTypes.string,
  message   : PropTypes.string, // re-rendering property
  type      : PropTypes.string  // re-rendering property
}

MessageCard.defaultProps = {
  className : "my-3",
  message   : "No message",
  type      : "normal"
}

export default MessageCard
