const { JWT_SECRET } = require('../secrets/secret.js')
const jwt = require('jsonwebtoken')
const User = require('../users/user-model.js')

// verifies the json web token in user's authorization header
const restricted = (req, res, next) => {
    const token = req.headers.authorization

    if (!token) {
        res.status(401).json("Token required")
    }

}
