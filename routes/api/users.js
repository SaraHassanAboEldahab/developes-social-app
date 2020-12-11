const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const gravatar = require("gravatar")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")

const User = require("../../models/User")


//@route  POST api/users
//@desc   Register user
//@access public

router.post("/", [
    //check takes 1st  argument is the input which we want to check and 2nd argument is a custom error msg
    check("name", "name is required").not().isEmpty(),
    check("email", "please include valid email").isEmail(),
    check("password", "please enter the password 6 or more characters").isLength({ min: 6 })

], async (req, res) => {
    //handling errors in response , where if there is an error, errors.array() will print an array of errors which contains for each error the location of this error and param which is input and msg which is the custom error msg which i put in check
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { name, email, password } = req.body
    try {
        //check if the user exists or not
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ errors: [{ msg: "user already exists" }] })//3mlt l errors kda 3shan tb2a zay errors.array() y3ny tb2a array brdo
        }
        //Get users gravatar
        const avatar = gravatar.url(email, {
            s: "200",//default size
            r: "pg", //rating
            d: "mm"  //default img if the user doesn't have an avatar
        })
        user = new User({
            name,
            email,
            password,
            avatar
        })

        //Encrypt the password
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        await user.save()

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