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
router.post('/BuyBitcoin', restricted, async (req, res, next) => {
    try {
        const decoded = jwtDecode(req.headers.authorization)
        const order = req.body
        const client_id = await Client.findClientID(decoded.email)


        const currentBalance = await Client.findClientBalance(decoded.email)
        if (currentBalance <
            (order.Bitcoin_balance * order.bitcoin_price)) {
            res.status(401)
                .json('Client does not possess enough currency in account to make purchase')
        }
        else {
            const updatedBalance = currentBalance -
                (order.Bitcoin_balance *
                    order.bitcoin_price)
            const currentBitcoin = await Client.findClientBitcoinWallet(decoded.email)
            const updatedBitcoin = currentBitcoin +
                order.Bitcoin_balance
            if (order.comm_type === 'USD') {
                updatedBalance = currentBalance -
                    (order.Bitcoin_balance *
                        order.bitcoin_price) -
                    order.comm_paid


            }
            else if (order.comm_type === 'Bitcoin') {
                updatedBitcoin = currentBitcoin +
                    order.Bitcoin_balance - order.comm_paid

            }



            const updateBitcoin = await Client.updateBitcoinWallet(decoded.email,
                updatedBitcoin)
            const updateUSD = await Client.updateUSDBalance(decoded.email,
                updatedBalance)


            const orderCreds = {
                client_id: client_id,
                date: Date(),
                comm_paid: order.comm_paid,
                comm_type: order.comm_type,
                Bitcoin_balance: order.Bitcoin_balance

            }



            const addOrder = await Client.addOrder(orderCreds)
            if (addOrder &&
                updateBitcoin &&
                updateUSD) {
                res.status(201)
                    .json(addOrder, updateBitcoin, updateUSD)
            }
        }


    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }



})


router.post('/SellBitcoin', restricted, async (req, res, next) => {
    try {
        const decoded = jwtDecode(req.headers.authorization)
        const order = req.body
        const client_id = await Client.findClientID(decoded.email)

        const currentBitcoin = await Client.findClientBitcoinWallet(decoded.email)
        if (currentBitcoin !== order.Bitcoin_value) {
            res.status(401)
                .json('Client does not posses enough bitcoin to perform sell')

        }
        else {
            const updatedBitcoin = currentBitcoin - order.Bitcoin_balance
            const currentBalance = await Client.findClientBalance(decoded.email)
            const updatedBalance = currentBalance +
                (order.Bitcoin_balance *
                    order.bitcoin_price)
            if (order.comm_type === 'USD') {
                updatedBalance = currentBalance +
                    (order.Bitcoin_balance *
                        order.bitcoin_price) - order.comm_paid
            }
            else if (order.comm_type === 'Bitcoin') {
                updatedBitcoin = currentBitcoin -
                    order.Bitcoin_balance -
                    order.comm_paid
            }

            const updateBitcoin = await Client.updateBitcoinWallet(decoded.email,
                updatedBitcoin)
            const updateUSD = await Client.updateUSDBalance(decoded.email,
                updatedBalance)

            const orderCreds = {
                client_id: client_id,
                date: Date(),
                comm_paid: order.comm_paid,
                comm_type: order.comm_type,
                Bitcoin_balance: order.Bitcoin_balance

            }
            const addOrder = await Client.addOrder(orderCreds)



            if (addOrder &&
                updateBitcoin &&
                updateUSD) {
                res.status(201)
                    .json(addOrder,
                        updateBitcoin,
                        updateUSD)
            }

        }
    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)

    }



})


router.get('/BitcoinWallet', restricted, async (req, res, next) => {
    const decode = jwtDecode(req.headers.authorization)
    let client = req.body


})

