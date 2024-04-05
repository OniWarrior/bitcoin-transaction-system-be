const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
    checkIfEmailExists,
    checkIfEmailAlreadyRegistered,
    checkForMissingEmailOrPassword

} = require('./auth-middleware');

const User = require('../users/user-model')

// path to register new account
router.post('/Signup', checkIfEmailAlreadyRegistered, checkForMissingEmailOrPassword, async (req, res, next) => {
    try {
        let user = req.body
        const rounds = parseInt(process.env.ROUNDS)
        const hash = bcrypt.hashSync(user.password, rounds)
        user.password = hash

        const addUser = await User.addUser(user)

        if (addUser) {
            res.status(201).json(addUser)
        }
    }
    catch (err) {
        res.status(500).json(`Server error: ${err.message}`)

    }


})


// path to login an existing user
router.post('/Login', checkForMissingEmailOrPassword, checkIfEmailExists, async (req, res, next) => {
    const { email, password } = req.body

    User.findByEmail(email)
        .then(([user]) => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = makeToken(user)

                res.status(200)
                    .cookie('token', token)
                    .json({
                        message: `Welcome back ${user.email}`,
                        token
                    })


            }
            else {
                res.status(401).json('Invalid email/password credentials')
            }




        })
        .catch(err => {
            res.status(500).json(`Server error: ${err.message}`)
        })

})

//create token after successful login
const makeToken = (user) => {

}

