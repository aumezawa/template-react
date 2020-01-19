import React from "react"
import PropTypes from "prop-types"

import Comment from "./comment.js"

const CommentViewer = React.memo(props => (
  <div className={ props.className }>
    {
      props.comments.map((comment, index) => (
        <Comment
          key={ index }
          user={ props.user }
          author={ comment.author }
          date={ comment.date }
          comment={ comment.comment }
        />
      ))
    }
  </div>
))

CommentViewer.propTypes = {
  className : PropTypes.string,
  comments  : PropTypes.array,
  user      : PropTypes.string
}

CommentViewer.defaultProps = {
  className : "",
  comments  : [],
  user      : "anonymous"
}

export default CommentViewer
