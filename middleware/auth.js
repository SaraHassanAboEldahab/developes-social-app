const jwt = require("jsonwebtoken")
const config = require("config")
const auth = (req, res, next) => {
    //Get token from header
    const token = req.header("x-auth-token")
    //check if not token in the header
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization is denied" })
    }
    //verify the token
    try {
        //when user signed up the token is generated for him by its id, so we can make the authentication process by verification that token and the token in the header of request
        const decoded = jwt.verify(token, config.get("jwtSecret"))
        req.user = decoded.user
        next()
    } catch (err) {
        res.status(401).json({ msg: "token is not valid" })
    }
}
module.exports = auth