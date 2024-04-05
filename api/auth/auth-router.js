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



        if (addUser(user)) {
            res.status(201).json(addUser)
        }






    }
    catch (err) {

    }


})

