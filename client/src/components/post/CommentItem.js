import React from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import { removeComment } from "../../actions/post"
import Moment from "react-moment"
import { Link } from "react-router-dom"

const CommentItem = ({
    postId,
    comment: { _id, text, name, avatar, user, date },
    auth,
    removeComment
}) => {
    return (
        <div className="post bg-white p-1 my-1">
            <div>
                <Link to={`/profile/${user}`}>
                    <img
                        className="round-img"
                        src={avatar}
                        alt=""
                    />
                    <h4>{name}</h4>
                </Link>
            </div>
            <div>
                <p className="my-1">{text}</p>
                <p className="post-date">
                    Posted On <Moment format="YYY/MM/DD">{date}</Moment>
                </p>
                {!auth.loading && auth.isAuthenticated && user === auth.user._id && (
                    <button type="button" className="btn btn-danger" onClick={() => removeComment(postId, _id)}>
                        <i className="fas fa-times"></i>
                    </button>
                )}
            </div>
        </div>
    )
}

CommentItem.propTypes = {
    removeComment: PropTypes.func.isRequired,
    postId: PropTypes.number.isRequired,
    comment: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    auth: state.auth
})
export default connect(mapStateToProps, { removeComment })(CommentItem)
