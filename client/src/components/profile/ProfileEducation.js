import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Moment from "react-moment"

const ProfileEducation = ({
    education: {
        school, degree, fieldofstudy, from, to, description
    } }) => {
    return (
        <div>
            <h3 className="text-dark">{school}</h3>
            <p>
                <Moment format="YYYY/MM/DD">{from}</Moment>-{" "}
                {to === null ? (
                    "Now"
                ) : (
                        <Moment format="YYYY/MM/DD">{to}</Moment>
                    )}
            </p>
            <p><strong>Degree: </strong>{degree}</p>
            <p>
                {fieldofstudy &&
                    <Fragment>
                        <strong>Field Of Study: </strong>
                        <span>{fieldofstudy}</span>
                    </Fragment>
                }
            </p>
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

ProfileEducation.propTypes = {
    education: PropTypes.array.isRequired
}

export default ProfileEducation
