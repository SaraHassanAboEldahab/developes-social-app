import React from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux"

const Alert = ({ alerts }) =>
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map(alert => ( //to return this div for each alert, and we use key because o/p will be array of jsx so need to unique key for each one
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg}
        </div>
    ))

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
}
const mapStateToProps = state => ({
    alerts: state.alert //where alerts is the props above , and alert is the alert reducer

})
export default connect(mapStateToProps)(Alert)
