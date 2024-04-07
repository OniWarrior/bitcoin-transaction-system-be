const router = require('express').Router()
const Client = require('./client-model')
const { default: jwtDecode } = require('jwt-decode')
const { restricted } = require('../auth/auth-middleware')

// retrieve all past orders for client
router.get('/Orders', restricted, (req, res, next) => {
    const decoded = jwtDecode(req.headers.authorization)
    Client.retrievePastOrders(decoded.client_id)
        .then((response) => {
            res.status(200).json(response)
        })
        .catch(err => {
            res.status(500).json(`Server error: ${err.message}`)
        })

})


// path to buy bitcoin
router.post('/BuyBitcoin', restricted, (req, res, next) => {

})

