const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.header('authorization')
    const accessToken = authHeader && authHeader.split(' ')[1]

    if (!accessToken)
        return res
            .status(401)
            .json({ success: false, message: 'Access token not found' })

    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN)

        req.userId = decoded.userId
        
        next()
    } catch (error) {
        console.log(error)
        res.status(403).json({
            success: false,
            message: 'Invalid access token'
        })
    }
}

module.exports = verifyToken
