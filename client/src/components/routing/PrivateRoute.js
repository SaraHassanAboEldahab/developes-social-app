//this private component will be added to every private component 
import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from "react-router-dom"
import { connect } from "react-redux"

const PrivateRoute = ({ component: Component,
    auth: { isAuthenticated, loading },
    ...rest
}) => (
        //if not authenticated and loading then go to login, if u auth user then go to this component
        <Route {...rest}
            render={props =>
                !isAuthenticated && !loading ? (<Redirect to="/login" />) : (<Component {...props} />)}
        />
    )

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(PrivateRoute)
