import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Moment from "react-moment"

const ProfileExperience = ({
    experience: {
        company, from, to, title, description
    } }) => {
    return (
        <div>
            <h3 className="text-dark">{company}</h3>
            <p>
                <Moment format="YYYY/MM/DD">{from}</Moment>-{" "}
                {to === null ? (
                    "Now"
                ) : (
                        <Moment format="YYYY/MM/DD">{to}</Moment>
                    )}
            </p>
            <p><strong>Position: </strong>{title}</p>
            <p>
                {description &&
                    <Fragment>
                        <strong>Description: </strong>
                        <span>{description}</span>
                    </Fragment>
                }
            </p>
        </div>
    )
}

ProfileExperience.propTypes = {
    experience: PropTypes.array.isRequired
}

export default ProfileExperience
