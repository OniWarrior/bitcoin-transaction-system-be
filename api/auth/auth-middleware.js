const { JWT_SECRET } = require('../secrets/secret.js')
const jwt = require('jsonwebtoken')
const User = require('../users/user-model.js')
const Client = require('../users/client-model.js')

// verifies the json web token in user's authorization header
const restricted = (req, res, next) => {
    const token = req.headers.authorization

    if (!token) {
        res.status(401).json("Token required")
    }
    else {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json('Token invalid')
            }
            else {
                req.decodedToken = decoded
                next()
            }
        })
    }

}


// Checks if Email exists when signing in.
const checkIfEmailExists = (req, res, next) => {
    const { email } = req.body

    User.findClientByEmail(email)
        .then(rows => {
            if (rows.length) {
                req.userData = rows[0]
                next()
            }
            else {
                res.status(401).json('Invalid credentials')
            }
        })
        .catch(err => {
            res.status(500).json(`Server error: ${err.message}`)
        })

}

// Check if Email already exists when registering a new account
const checkIfEmailAlreadyRegistered = (req, res, next) => {
    const { email } = req.body

    User.findClientByEmail(email)
        .then(rows => {
            if (rows.email) {
                res.status(422).json("Email is already registered")
            }
            else {
                next()
            }
        })
        .catch(err => {
            res.status(500).json(`Server error: ${err.message}`)
        })
}


// check for missing or undefined email/password when
// signing in or registering.

const checkForMissingEmailOrPassword = (req, res, next) => {
    const { email, password } = req.body

    if (!email || email === "" ||
        !password || password == "") {
        res.status(400).json("Email and password are required")

    }
    else {
        next()
    }
}

// check if password exists to confirm identity of client
const checkIfPasswordExists = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const client = await Client.retrieveClientInfo(email)
        if (password != client.password) {
            res.status(400)
                .json('Invalid credentials. Identity not confirmed')
        }
        else {
            next()
        }

    }
    catch (err) {
        res.status(500).json(`Server Error: ${err.message}`)
    }



}

module.exports = {
    restricted,
    checkIfEmailExists,
    checkIfEmailAlreadyRegistered,
    checkForMissingEmailOrPassword,
    checkIfPasswordExists
}
