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
    const decoded = jwtDecode(req.headers.authorization)
    const order = req.body
    Client.addOrder(order)
        .then((response) => {
            const currentBitcoin = Client.findClientBitcoinWallet(decoded.email)
            const updatedBitcoin = currentBitcoin + order.bitcoin_amount
            Client.updateBitcoinWallet(decoded.email, updatedBitcoin)
                .then(() => {
                    const currentBalance = Client.findClientBalance(email)
                    const updatedBalance = currentBalance - order.comm_paid
                    Client.updateUSDBalance(decoded.email, updatedBalance)

                })

            res.status(201).json(response)

        })
        .catch(err => {
            res.status(500).json(`Server Error: ${err.message}`)
        })



})


router.post('/SellBitcoin', restricted, async (req, res, next) => {
    try {

    }
    catch (err) {

    }



})

