const express = require("express")
const router = express.Router()
const request = require("request")
const config = require("config")
const { check, validationResult } = require("express-validator")
const auth = require("../../middleware/auth")
const User = require("../../models/User")
const Profile = require("../../models/Profile")
const Post = require("../../models/Post")

//@route  GET api/profile/me
//@desc   get current users profile
//@access private
router.get("/me", auth, async (req, res) => {
    try {
        //populate takes =>1- the model name , 2- the fields which we want bring from user
        const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["name", "avatar"])
        if (!profile) {
            return res.status(401).json({ msg: "ther is no profile for this user !" })
        }
        res.send(profile)
    } catch (err) {
        console.log(err.message)
        res.status(500).send("server error")
    }
})

//@route  POST api/profile
//@desc   create or update user profile
//@access private

router.post("/", [
    auth,
    check("status", "status is required").notEmpty(),
    check("skills", "skills is required").not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() })
    }
    const { company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        linkedin,
        instagram } = req.body;

    //////////////////////// 1st way ////////////////////
    /*profileFields={}
     profileFields.user = req.user.id
         if (company) profileFields.company = company;
         if (website) profileFields.website = website;
         if (location) profileFields.location = location;
         if (bio) profileFields.bio = bio;
         if (status) profileFields.status = status;
         if (githubusername) profileFields.githubusername = githubusername;
         if (skills) {
             profileFields.skills = skills.split(",").map((skill) => skill.trim())
         }

         //build social object
         profileFields.social = {}
         if (youtube) profileFields.social.youtube = youtube;
         if (facebook) profileFields.social.facebook = facebook;
         if (twitter) profileFields.social.twitter = twitter;
         if (linkedin) profileFields.social.linkedin = linkedin;
         if (instagram) profileFields.social.instagram = instagram;*/

    //////////////////////// 2nd way ////////////////////

    //build profile object
    const profileFields = {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills
    }
    profileFields.user = req.user.id
    profileFields.skills = skills.split(",").map((skill) => skill.trim())

    //build social object
    profileFields.social = { youtube, facebook, twitter, linkedin, instagram }

    try {
        let profile = await Profile.findOne({ user: req.user.id })
        if (profile) {
            //update
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
            return res.json(profile)
        }
        //create
        profile = new Profile(profileFields)
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("server error")
    }
})

//@route  GET api/profile
//@desc   get all profiles
//@access public
router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find().populate("user", ["name", "avatar"])
        res.send(profiles)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("server error")
    }
})

//@route  GET api/profile/user/:user_id
//@desc   get profile by user ID
//@access public
router.get("/user/:user_id", async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate("user", ["name", "avatar"])
        if (!profile) return res.status(400).json({ msg: "Profile not found !!" })
        res.send(profile)
    } catch (err) {
        console.error(err.message)
        if (err.kind == "ObjectId") return res.status(400).json({ msg: "Profile not found !!" })
        res.status(500).send("server error")
    }
})

//@route  DELETE api/profile
//@desc   delete profile, user & posts
//@access private
router.delete("/", auth, async (req, res) => {
    try {
        //remove posts
        await Post.deleteMany({ user: req.user.id })
        //remove profile
        await Profile.findOneAndRemove({ user: req.user.id })
        //remove user
        await User.findOneAndRemove({ _id: req.user.id })
        res.json({ msg: "User deleted" })
    } catch (err) {
        console.error(err.message)
        res.status(500).send("server error")
    }
})

//@route  PUT api/profile/experience
//@desc   add profile experience
//@access private
router.put("/experience", [auth, [
    check("title", "Title is required").not().isEmpty(),
    check("company", "Company is required").not().isEmpty(),
    check("from", "From date is required").not().isEmpty(),

]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status().json({ errors: errors.array() })
    }
    const { title, company, location, from, to, current, description } = req.body
    const newExp = { title, company, location, from, to, current, description }
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        //shift method adds new items to the beginning of an array, and returns the new length
        profile.experience.unshift(newExp)
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("server error")
    }
})

//@route  DELETE api/profile/experience
//@desc   delete experience from profile
//@access private
router.delete("/experience/:exp_id", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        //Get remove index,hwa hena kda haymshy 3al l array element element w haygybly index of the index which is req.params.exp_id
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

        //at that index (removeIndex) of the experience array remove 1 item
        profile.experience.splice(removeIndex, 1)
        await profile.save()
        res.send(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("server error")
    }
})

//@route  PUT api/profile/education
//@desc   add profile education
//@access private
router.put("/education", [auth, [
    check("school", "school is required").not().isEmpty(),
    check("degree", "degree is required").not().isEmpty(),
    check("fieldofstudy", "fieldofstudy is required").not().isEmpty(),
    check("from", "From date is required").not().isEmpty()

]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status().json({ errors: errors.array() })
    }
    const { school, degree, fieldofstudy, from, to, current, description } = req.body
    const newEdu = { school, degree, fieldofstudy, from, to, current, description }
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        //shift method adds new items to the beginning of an array, and returns the new length
        profile.education.unshift(newEdu)
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("server error")
    }
})

//@route  DELETE api/profile/education
//@desc   delete education from profile
//@access private
router.delete("/education/:edu_id", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        //Get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

        //at that index of the education array remove 1 item
        profile.education.splice(removeIndex, 1)
        await profile.save()
        res.send(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("server error")
    }
})

//@route  GET api/profile/github/:username
//@desc   get user repositories from github
//@access public
router.get("/github/:username", (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get("githubClientId")}&client_secret=${config.get("githubSecret")}`,
            method: "GET",
            headers: { "user-agent": "node.js" }
        }
        request(options, (error, response, body) => {
            if (error) console.error(error)
            if (response.statusCode != 200) {
                return res.status(500).json({ msg: "No Github profile found !" })
            }
            res.json(JSON.parse(body))
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send("server error")
    }
})
module.exports = router