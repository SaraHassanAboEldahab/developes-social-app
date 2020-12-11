import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import { addComment, removeComment } from "../../actions/post"

const CommentItem = ({ addComment, postId }) => {
    const [text, setText] = useState("")
    return (
        <div className="post-form">
            <div className="bg-light p">
                <h3>Comments</h3>
            </div>
            <form className="form my-1"
                onSubmit={e => {
                    e.preventDefault()
                    addComment(postId, { text })
                    setText("")
                }}>
                <textarea
                    name="text"
                    cols="30"
                    rows="5"
                    placeholder="Leave a comment..."
                    required
                    value={text}
                    onChange={e => setText(e.target.value)}
                ></textarea>
                <input type="submit" className="btn btn-dark my-1" value="Submit" />
            </form>
        </div>
    )
}

CommentItem.propTypes = {
    addComment: PropTypes.func.isRequired
}

export default connect(null, { addComment })(CommentItem)
