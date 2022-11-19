const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

// @route [POST] api/auth/register
// @desc Register a user
// @access Public
router.post('/register', async (req, res) => {
    const { username, password } = req.body

    // Validate
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Missing username and/or password'
        })
    }

    // Check for existing user
    try {
        const user = await User.findOne({ username })
        if (user)
            return res
                .status(400)
                .json({ success: false, message: 'Username already exists' })

        // All good
        const hashedPassword = await argon2.hash(password)
        const newUser = new User({ username, password: hashedPassword })
        await newUser.save()

        // Return token
        const accessToken = jwt.sign(
            { userId: newUser._id },
            process.env.ACCESS_TOKEN
        )

        res.json({
            success: true,
            message: 'Registered successfully',
            accessToken
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
})

// @route [POST] api/auth/login
// @desc User login
// @access Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body

    // Validate
    if (!username || !password)
        return res
            .status(401)
            .json({ success: false, message: 'Missing username or password' })

    // Check for existing user
    try {
        const user = await User.findOne({ username })
        if (!user)
            return res.status(401).json({
                success: false,
                message: 'Incorrect username or password'
            })

        // Check password
        const passwordValid = await argon2.verify(user.password, password)
        if (!passwordValid)
            return res.status(401).json({
                success: false,
                message: 'Incorrect username or password'
            })

        // All good -> Return token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN
        )
        return res.json({
            success: true,
            message: 'Logged in successfully',
            accessToken
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
})

module.exports = router
