const router = require('express').Router()
const Client = require('./client-model')
const { default: jwtDecode } = require('jwt-decode')
const { restricted, checkIfPasswordExists } = require('../auth/auth-middleware')
const Trader = require('./trader-model')


// path to retrieve client in search
router.get('/FindClient/:client_id', restricted, async (req, res, next) => {
    try {

    }
    catch (err) {

    }

})