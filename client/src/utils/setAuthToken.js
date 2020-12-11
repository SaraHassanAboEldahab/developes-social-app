import axios from "axios";
//this function to add the token to the header(x-auth-token)
const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common["x-auth-token"] = token
    } else {
        delete axios.defaults.headers.common["x-auth-token"]
    }
}
export default setAuthToken;