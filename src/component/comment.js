import React from "react"
import PropTypes from "prop-types"

const Comment = React.memo(props => {
  const align = (props.user === props.author) ? "justify-content-end" : "justify-content-start"
  const color = (props.user === props.author) ? "bg-success"          : "bg-secondary"
  const none  = (props.user === props.author) ? "d-none"              : ""

  return (
    <>
      <div className={ `d-flex ${ align } my-1` }>
        <div className="flex-shrink-0 align-self-center text-monospace mr-1">
          <div className={ `${ none }` }>{ props.author }</div>
          <div>{ props.date }</div>
        </div>
        <div className={ `align-self-center rounded-lg ${ color } text-white ml-1 py-1 px-3` }>
          <div className={ `text-wrap text-break` }>
            { props.comment.split("\n").map((line, index) => <div key={ index }>{ line }</div>) }
          </div>
        </div>
      </div>
      <div className="clearfix"></div>
    </>
  )
})

Comment.propTypes = {
  user    : PropTypes.string,
  author  : PropTypes.string,
  date    : PropTypes.string,
  comment : PropTypes.string
}

Comment.defaultProps = {
  user    : "anonymous",
  author  : "anonymous",
  date    : "",
  comment : ""
}

export default Comment
