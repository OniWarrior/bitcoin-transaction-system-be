const router = require('express').Router()
const Client = require('./client-model')
const { default: jwtDecode } = require('jwt-decode')
const { restricted } = require('../auth/auth-middleware')

// retrieve all past orders for client
router.get('/Orders', restricted, (req, res, next) => {
    Client.retrievePastOrders()
        .then((response) => {
            res.status(200).json(response)
        })

})