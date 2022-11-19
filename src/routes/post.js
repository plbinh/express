const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const { verifyToken } = require('../middleware')

// @route [GET] /api/posts
// @desc Get post
// @access Private
router.get('/', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.userId }).populate('user', [
            'username'
        ])
        if (!posts)
            return res
                .status(400)
                .json({ success: false, message: 'Post not found' })

        res.json({ success: true, posts })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
})

// @route [POST] api/posts/create
// @desc Create a new post
// @access Private
router.post('/create', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body

    // Validate title
    if (!title)
        return res
            .status(400)
            .json({ success: false, message: 'Missing title' })

    try {
        // Create a new post
        const newPost = new Post({
            title,
            description,
            url: !url || (url.startsWith('https://') ? url : `https://${url}`),
            status: status || 'TO LEARN',
            user: req.userId
        })

        await newPost.save()

        res.json({
            success: true,
            message: 'Created a new post successfully',
            post: newPost
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
})

// @route [PUT] /update/:postId
// @desc Update post
// @access Private
router.put('/update/:postId', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body

    // Validate
    if (!title)
        return res
            .status(400)
            .json({ success: false, message: 'Missing title' })

    try {
        let updatedPost = {
            title,
            description,
            url: url.startsWith('https://') ? url : `https://${url}`,
            status: status || 'TO LEARN'
        }

        const postUpdateCondition = {
            _id: req.params.postId,
            user: req.userId
        }

        updatedPost = await Post.findOneAndUpdate(
            postUpdateCondition,
            updatedPost,
            { new: true }
        )

        // User not authorized to update post or post not found'
        if (!updatedPost)
            return res.status(40).json({
                success: false,
                message: 'Post not found or user not authorized'
            })

        // All good
        res.json({
            success: true,
            message: 'Updated post successfully',
            post: updatedPost
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
})

// @route [GET] /api/posts/:postId
// @desc Get post
// @access Private
router.get('/:postId', verifyToken, async (req, res) => {
    const postId = req.params.postId

    try {
        const post = await Post.findOne({ _id: postId })
        if (!post)
            return res
                .status(400)
                .json({ success: false, message: 'Post not found' })

        res.json({ success: true, message: 'Got post successfully', post })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error
        })
    }
})

module.exports = router
