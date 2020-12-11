const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const auth = require("../../middleware/auth")
const User = require("../../models/User")
const Profile = require("../../models/Profile")
const Post = require("../../models/Post")

//@route  POST api/posts
//@desc   Create a post
//@access private
router.post("/", [auth, [
    check("text", "Text is required").notEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const user = await User.findById(req.user.id).select("-password")
        const newPost = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }
        const post = new Post(newPost)
        await post.save()
        res.json(post)
    } catch (err) {
        console.log(err.message)
        res.status(500).send("server error")
    }
})

//@route  GET api/posts
//@desc   Get All posts
//@access private
router.get("/", auth, async (req, res) => {
    try {
        //const posts = await Post.find({ user: req.user.id }).sort({ date: -1 })
        //any auth user can get all posts of all users
        const posts = await Post.find().sort({ date: -1 })
        res.json(posts)
    } catch (err) {
        console.log(err.message)
        res.status(500).send("server error")
    }
})

//@route  GET api/posts/:id
//@desc   Get post by id
//@access private
router.get("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: "Post not found" })
        }
        res.json(post)
    } catch (err) {
        console.log(err.message)
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found" })
        }
        res.status(500).send("server error")
    }
})

//@route  DELETE api/posts/:id
//@desc   Delete post by id
//@access private
router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: "Post not found" })
        }
        //check if this post for that user which made the request, we used toString() because post.user is ObjectId
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized !" })
        }
        await post.remove()
        res.json({ msg: "Post Removed" })
    } catch (err) {
        console.log(err.message)
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found" })
        }
        res.status(500).send("server error")
    }
})

//@route  PUT api/posts/like/:id
//@desc   Like post
//@access private
router.put("/like/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        //check if this post has been already liked by the user which made the request
        if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: "Post already liked" })
        }
        //if this post hasn't been liked by the user which made the request, add it to the likes array
        post.likes.unshift({ user: req.user.id })
        await post.save()
        res.json(post.likes)
    } catch (err) {
        console.log(err.message)
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found" })
        }
        res.status(500).send("server error")
    }
})

//@route  PUT api/posts/unlike/:id
//@desc   UnLike post
//@access private
router.put("/unlike/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        //check if this post has been already unliked by the user which made the request
        if (post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: "Post has not yet been liked" })
        }
        //Get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex, 1)
        await post.save()
        res.json(post.likes)
    } catch (err) {
        console.log(err.message)
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found" })
        }
        res.status(500).send("server error")
    }
})

//@route  POST api/posts/comment/:id
//@desc   comment on a post
//@access private
router.post("/comment/:id", [auth, [
    check("text", "Text is required").notEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const user = await User.findById(req.user.id).select("-password")
        const post = await Post.findById(req.params.id)
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }
        post.comments.unshift(newComment)
        await post.save()
        res.json(post.comments)
    } catch (err) {
        console.log(err.message)
        res.status(500).send("server error")
    }
})

//@route  DELETE api/posts/comment/:id/:comment_id
//@desc   Delete a comment
//@access private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const comment = post.comments.find(comment => comment.id === req.params.comment_id)
        //check if comment exists
        if (!comment) {
            return res.status(400).json({ msg: "Comment does not exist" })
        }

        //check if the user id stored in comment is the same user that made the request
        if (comment.user.toString() !== req.user.id) {
            return res.status(400).json({ msg: "User not authorized" })
        }
        //Get remove index
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)
        post.comments.splice(removeIndex, 1)
        await post.save()
        res.json(post.comments)
    } catch (err) {
        console.log(err.message)
        res.status(500).send("server error")
    }
})

//@route  PATCH api/posts/comment/:id/:comment_id
//@desc   Update a comment
//@access private
router.patch("/comment/:id/:comment_id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const comment = post.comments.find(comment => comment.id === req.params.comment_id)
        //check if comment exists
        if (!comment) {
            return res.status(400).json({ msg: "Comment does not exist" })
        }

        //check if the user id stored in comment is the same user that made the request
        if (comment.user.toString() !== req.user.id) {
            return res.status(400).json({ msg: "User not authorized" })
        }
        comment.text = req.body.text
        await post.save()
        res.json(post.comments)
    } catch (err) {
        console.log(err.message)
        res.status(500).send("server error")
    }
})

module.exports = router