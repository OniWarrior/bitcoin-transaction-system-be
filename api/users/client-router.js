const router = require('express').Router()
const Client = require('./client-model')
const { default: jwtDecode } = require('jwt-decode')
const { restricted } = require('../auth/auth-middleware')
const Trader = require('./trader-model')


// retrieve all past orders for client
router.get('/Orders', restricted, async (req, res, next) => {
    try {
        const decoded = jwtDecode(req.headers.authorization)
        const client = await Client.retrieveClientInfo(decoded.email)
        const orders = await Client.retrievePastOrders(client.client_id)
        if (client &&
            orders) {
            res.status(200)
                .json(client, orders)
        }


    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }



})


// path to buy bitcoin
router.post('/BuyBitcoin', restricted, async (req, res, next) => {
    try {
        const decoded = jwtDecode(req.headers.authorization)
        const order = req.body
        const client = await Client.retrieveClientInfo(decoded.email)


        // Check balance to see if enough money exists to purchase bitcoin


        if (client.USD_balance <
            (order.Bitcoin_balance * order.bitcoin_price)) {
            res.status(401)
                .json('Client does not possess enough currency in account to make purchase')
        }
        else {

            // Update balance and update bitcoin amount
            let updatedBalance = currentBalance -
                (order.Bitcoin_balance *
                    order.bitcoin_price)
            const currentBitcoin = client.Bitcoin_balance
            let updatedBitcoin = currentBitcoin +
                order.Bitcoin_balance


            // retrieve member level of client
            const memberLevel = client.mem_level
            let commissionPay = 0


            // Update balance according to choice made
            // by client on how to pay for commission payment
            if (order.comm_type === 'USD') {

                // calculate commission pay based on member level
                if (memberLevel === 'Silver') {
                    commissionPay = (order.Bitcoin_balance * order.Bitcoin_price) * 0.1


                    // reject if client doesn't possess enough money
                    if (client.USD_balance <
                        ((order.Bitcoin_balance * order.bitcoin_price) +
                            commissionPay)) {
                        res.status(401)
                            .json('Client does not possess enough fiat USD to make purchase')
                    }
                    else {
                        updatedBalance -= commissionPay

                    }

                }
                else if (memberLevel === 'Gold') {
                    commissionPay = (order.Bitcoin_balance * order.Bitcoin_price) * 0.05

                    // reject if client doesn't possess enough money
                    if (client.USD_balance <
                        ((order.Bitcoin_balance * order.bitcoin_price) +
                            commissionPay)) {
                        res.status(401)
                            .json('Client does not possess enough fiat USD to make purchase')
                    }
                    else {
                        updatedBalance -= commissionPay

                    }

                }

            }
            else if (order.comm_type === 'Bitcoin') {

                // calculate commission pay based on member level
                if (memberLevel === 'Silver') {

                    commissionPay = (order.Bitcoin_balance) * 0.1


                    // reject if client doesn't possess enough money
                    if (client.Bitcoin_balance < commissionPay) {
                        res.status(401)
                            .json('Client does not possess enough bitcoin to make purchase')
                    }
                    else {
                        updatedBalance -= commissionPay

                    }

                }
                else if (memberLevel === 'Gold') {
                    commissionPay = (order.Bitcoin_balance) * 0.05
                    // reject if client doesn't possess enough money
                    if (client.Bitcoin_balance < commissionPay) {
                        res.status(401)
                            .json('Client does not possess enough bitcoin to make purchase')
                    }
                    else {
                        updatedBalance -= commissionPay

                    }

                }

            }


            // Insert the updated bitcoin and usd balance to database account
            const updateBitcoin = await Client.updateBitcoinWallet(decoded.email,
                updatedBitcoin)
            const updateUSD = await Client.updateUSDBalance(decoded.email,
                updatedBalance)

            // create object for record of order
            const orderCreds = {
                client_id: client.client_id,
                date: Date(),
                comm_paid: order.comm_paid,
                comm_type: order.comm_type,
                Bitcoin_balance: order.Bitcoin_balance

            }


            const updateNumTrades = await Client.updateNumTrades(client.email, client.num_trades)


            // insert order into order table
            const addOrder = await Client.addOrder(orderCreds)
            if (addOrder &&
                updateBitcoin &&
                updateUSD &&
                updateNumTrades) {
                res.status(201)
                    .json(addOrder, updateBitcoin, updateUSD, updateNumTrades)
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

        // retrieve client info
        const client = await Client.retrieveClientInfo(decoded.email)

        // retrieve current bitcoin balance and check to see if sale can be made

        if (client.Bitcoin_balance < order.Bitcoin_balance) {
            res.status(401)
                .json('Client does not posses enough bitcoin to perform sell')

        }
        else {

            // update balance of bitcoin and balance of usd
            let updatedBitcoin = client.Bitcoin_balance - order.Bitcoin_balance
            let updatedBalance = client.USD_balance +
                (order.Bitcoin_balance *
                    order.bitcoin_price)
            let commissionPay = 0

            // update balance or bitcoin balance based on selection
            // of how client wants to pay commission
            if (order.comm_type === 'USD') {

                if (client.mem_level === 'Silver') {
                    commissionPay = (order.Bitcoin_balance *
                        order.bitcoin_price) * 0.1
                    if (client.USD_balance < commissionPay) {
                        res.status(401)
                            .json('Client does not possess enough fiat USD to pay commission')
                    }
                    else {
                        updatedBalance -= commissionPay

                    }

                }
                else if (client.mem_level === 'Gold') {

                    commissionPay = (order.Bitcoin_balance *
                        order.bitcoin_price) * 0.05
                    if (client.USD_balance < commissionPay) {
                        res.status(401)
                            .json('Client does not possess enough fiat USD to pay commission')
                    }
                    else {
                        updatedBalance -= commissionPay

                    }

                }

            }
            else if (order.comm_type === 'Bitcoin') {
                if (client.mem_level === 'Silver') {
                    commissionPay = (order.Bitcoin_balance) * 0.1
                    if (client.Bitcoin_balance < commissionPay) {
                        res.status(401)
                            .json('Client does not possess enough bitcoin to pay commission')
                    }
                    else {
                        updatedBitcoin -= commissionPay

                    }

                }
                else if (client.mem_level === 'Gold') {

                    commissionPay = (order.Bitcoin_balance) * 0.05
                    if (client.Bitcoin_balance < commissionPay) {
                        res.status(401)
                            .json('Client does not possess enough bitcoin to pay commission')
                    }
                    else {
                        updatedBitcoin -= commissionPay

                    }

                }
            }


            // insert balance and bitcoin into tables to update
            const updateBitcoin = await Client.updateBitcoinWallet(decoded.email,
                updatedBitcoin)
            const updateUSD = await Client.updateUSDBalance(decoded.email,
                updatedBalance)


            // create object for record of order
            const orderCreds = {
                client_id: client.client_id,
                date: Date(),
                comm_paid: order.comm_paid,
                comm_type: order.comm_type,
                Bitcoin_balance: order.Bitcoin_balance

            }
            const addOrder = await Client.addOrder(orderCreds)
            const updateNumTrades = await Client.updateNumTrades(client.email, client.num_trades)


            if (addOrder &&
                updateBitcoin &&
                updateUSD &&
                updateNumTrades) {
                res.status(201)
                    .json(addOrder,
                        updateBitcoin,
                        updateUSD,
                        updateNumTrades)
            }

        }
    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)

    }



})


// path to retrieve bitcoin wallet of client
router.get('/BitcoinWallet', restricted, async (req, res, next) => {
    try {
        const decoded = jwtDecode(req.headers.authorization)
        const wallet = await Client.findClientBitcoinWallet(decoded.email)
        if (wallet) {
            res.status(200)
                .json(wallet)
        }

    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }



})


// path to transfer money to trader
router.post('/TransferMoney', restricted, async (req, res, next) => {
    try {

        // check the usd balance first
        const decoded = jwtDecode(req.headers.authorization)
        const usdWallet = await Client.findClientBalance(decoded.email)
        const transfer = req.body

        if (usdWallet <= 0) {
            res.status(401)
                .json('You do not have enough usd in your account')
        }

        // retrieve client id, trader id
        const clientId = await Client.findClientID(decoded.email)
        const traderId = await Client.findTraderID(clientId)

        // create object for the record
        const transferCreds = {
            trader_id: traderId,
            client_id: clientId,
            amount_paid: transfer.amount_paid,
            date: Date()
        }


        // create record of money transfer
        const transferMoney = await Client.transerMoney(transferCreds)

        // update the usd balance of the client
        const reducedBalance = usdWallet - transfer.amount_paid
        const updateUSDBalance = await Client.updateUSDBalance(reducedBalance)

        // update the transfer account of the trader
        const updateTransferAccount = await Trader.updateTransferAccountById(traderId, transfer.amount_paid)




        if (usdWallet &&
            clientId &&
            traderId &&
            transferMoney &&
            updateUSDBalance,
            updateTransferAccount) {
            res.status(201)
                .json(usdWallet, clientId, traderId, updateUSDBalance, updateTransferAccount)

        }



    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})

module.exports = router