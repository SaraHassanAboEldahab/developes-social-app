const express = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")
const User = require("../../models/User")
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")

//@route  GET api/auth
//@desc   test route
//@access public
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).send({ msg: "server error" })
    }
})
//@route  POST api/auth
//@desc   login user (authenticate user & get the token)
//@access public

router.post("/", [
    //check takes 1st  argument is the input which we want to check and 2nd argument is a custom error msg
    check("email", "please include valid email").isEmail(),
    check("password", "password is required").exists()

], async (req, res) => {
    //handling errors in response , where if there is an error, errors.array() will print an array of errors which contains for each error the location of this error and param which is input and msg which is the custom error msg which i put in check
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body
    try {
        //check if the user exists or not
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] })//3mlt l errors kda 3shan tb2a zay errors.array() y3ny tb2a array brdo
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] })
        }
        //return jsonWebToken
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, config.get("jwtSecret"), (err, token) => {
            if (err) throw err;
            res.json({ token })
        })
    } catch (e) {
        console.error(e.message)
        res.status(500).send("Server error")
    }
})

module.exports = router