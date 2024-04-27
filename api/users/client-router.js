const router = require('express').Router()
const Client = require('./client-model')
const { jwtDecode } = require('jwt-decode');
const { restricted, checkIfPasswordExists } = require('../auth/auth-middleware')
const Trader = require('./trader-model')



// retrieve all past orders for client
router.get('/Orders', async (req, res, next) => {
    try {
        const decoded = jwtDecode(req.headers.authorization)
        const client = await Client.retrieveClientInfo(decoded.email)
        const orders = await Client.retrievePastOrders(client.client_id)


        if (client && orders) {
            res.status(200)
                .json(orders)
        }


    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }



})


// path to buy bitcoin
router.post('/BuyBitcoin', checkIfPasswordExists, async (req, res, next) => {
    try {
        const decoded = jwtDecode(req.headers.authorization)
        const order = req.body
        const client = await Client.retrieveClientInfo(decoded.email)


        // Check balance to see if enough money exists to purchase bitcoin
        if (client.USD_balance <
            (order.Bitcoin_balance * order.bitcoin_price) ||
            isNaN(client.USD_balance) || client.USD_balance < 0) {
            res.status(401)
                .json('Client does not possess enough currency in account to make purchase')
        }
        else {

            // Update balance and update bitcoin amount
            let updatedBalance = client.USD_balance -
                (order.Bitcoin_balance *
                    order.bitcoin_price)
            const currentBitcoin = client.Bitcoin_balance
            let updatedBitcoin = currentBitcoin +
                order.Bitcoin_balance


            // retrieve member level of client
            const memberLevel = client.mem_level
            let commissionPay = 0.00
            let commissionPayUSD;
            let commissionPayBitcoin;


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
                        commissionPayUSD = commissionPay

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
                        commissionPayUSD = commissionPay

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
                        commissionPayBitcoin = commissionPay

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
                        commissionPayBitcoin = commissionPay

                    }

                }

            }


            // Insert the updated bitcoin and usd balance to database account
            const updateBitcoin = await Client.updateBitcoinWallet(decoded.email,
                updatedBitcoin)
            const updateUSD = await Client.updateUSDBalance(decoded.email,
                updatedBalance)

            const date = new Date()
            const formattedDate = `${date.getFullYear()}` + '-' + `${date.getMonth()}` + '-' + `${date.getDate()}`

            // create object for record of order
            const orderCreds = {
                client_id: client.client_id,
                date: formattedDate,
                comm_paid: commissionPay,
                comm_type: order.comm_type,
                Bitcoin_balance: order.Bitcoin_balance,
                isCancelled: false

            }

            // increment trades by 1 and update number of client trades
            const incrementedTrades = (client.num_trades + 1)
            const updateNumTrades = await Client.updateNumTrades(client.email, incrementedTrades)

            // Update trader balance--based on comm_type            
            let updateUSDBalanceOfTrader;
            let updateBitcoinBalanceOfTrader;

            // insert order into order table
            const addOrder = await Client.addOrder(orderCreds)

            if (order.comm_type === 'USD') {

                updateUSDBalanceOfTrader = await Trader.updateUSDBalanceOfTrader(client.trader_id, commissionPayUSD)



                if (addOrder &&
                    client &&
                    updateBitcoin &&
                    updateUSD &&
                    updateNumTrades &&
                    updateUSDBalanceOfTrader

                ) {
                    res.status(201)
                        .json({
                            message: 'Successfully bought bitcoin',
                            amount: order.Bitcoin_balance
                        })
                }
            }
            else if (order.comm_type === 'Bitcoin') {
                updateBitcoinBalanceOfTrader = await Trader.updateBitcoinBalanceOfTrader(client.trader_id, commissionPayBitcoin)



                if (addOrder &&
                    client &&
                    updateBitcoin &&
                    updateUSD &&
                    updateNumTrades &&
                    updateBitcoinBalanceOfTrader

                ) {
                    res.status(201)
                        .json(
                            {
                                message: 'Successfully bought bitcoin',
                                amount: order.Bitcoin_balance
                            }
                        )
                }
            }


        }


    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }



})

// path to sell bitcoin 
router.post('/SellBitcoin', checkIfPasswordExists, async (req, res, next) => {
    try {
        const decoded = jwtDecode(req.headers.authorization)
        const order = req.body

        // retrieve client info
        const client = await Client.retrieveClientInfo(decoded.email)
        res.status(200).json(client)
        // retrieve current bitcoin balance and check to see if sale can be made

        if (client.Bitcoin_balance < order.Bitcoin_balance ||
            isNaN(client.Bitcoin_balance) || client.Bitcoin_balance < 0) {
            res.status(401)
                .json('Client does not posses enough bitcoin to perform sell')

        }
        else {

            // update balance of bitcoin and balance of usd
            let updatedBitcoin = client.Bitcoin_balance - order.Bitcoin_balance
            let updatedBalance = client.USD_balance +
                (order.Bitcoin_balance *
                    order.bitcoin_price)
            let commissionPay = 0.00
            let commissionPayUSD;
            let commissionPayBitcoin;

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
                        commissionPayUSD = commissionPay

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
                        commissionPayUSD = commissionPay

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
                        commissionPayBitcoin = commissionPay

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
                        commissionPayBitcoin = commissionPay

                    }

                }
            }

            res.status(200).json(updatedBalance)
            // insert balance and bitcoin into tables to update
            const updateBitcoin = await Client.updateBitcoinWallet(decoded.email,
                updatedBitcoin)
            const updateUSD = await Client.updateUSDBalance(decoded.email,
                updatedBalance)
            const date = new Date()
            const formattedDate = `${date.getFullYear()}` + '-' + `${date.getMonth()}` + '-' + `${date.getDate()}`

            // create object for record of order
            const orderCreds = {
                client_id: client.client_id,
                date: formattedDate,
                comm_paid: commissionPay,
                comm_type: order.comm_type,
                Bitcoin_balance: order.Bitcoin_balance,
                isCancelled: false

            }
            // increment trades by 1 and update number of client trades
            const incrementedTrades = (client.num_trades + 1)
            const updateNumTrades = await Client.updateNumTrades(client.email, incrementedTrades)

            // Update trader balance--based on comm_type

            let updateUSDBalanceOfTrader;
            let updateBitcoinBalanceOfTrader;

            // insert order into order table
            const addOrder = await Client.addOrder(orderCreds)

            if (order.comm_type === 'USD') {
                updateUSDBalanceOfTrader = await Trader.updateUSDBalanceOfTrader(client.trader_id, commissionPayUSD)


                if (addOrder &&
                    client &&
                    updateBitcoin &&
                    updateUSD &&
                    updateNumTrades &&
                    updateUSDBalanceOfTrader) {
                    res.status(201)
                        .json({
                            message: 'successfully sold bitcoin',
                            amount: order.Bitcoin_balance
                        })
                }
            }
            else if (order.comm_type === 'Bitcoin') {
                updateBitcoinBalanceOfTrader = await Trader.updateBitcoinBalanceOfTrader(client.trader_id, commissionPayBitcoin)


                if (addOrder &&
                    client &&
                    updateBitcoin &&
                    updateUSD &&
                    updateNumTrades &&
                    updateBitcoinBalanceOfTrader) {
                    res.status(201)
                        .json({
                            message: 'successfully sold bitcoin',
                            amount: order.Bitcoin_balance
                        })
                }
            }


        }
    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)

    }



})


// path to retrieve bitcoin wallet of client
router.get('/BitcoinWallet', async (req, res, next) => {
    try {
        const decoded = jwtDecode(req.headers.authorization)
        const wallet = await Client.retrieveClientInfo(decoded.email)

        if (wallet) {
            res.status(200)
                .json(wallet.Bitcoin_balance)
        }

    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }



})


// path to transfer money to trader
router.post('/TransferMoney', async (req, res, next) => {
    try {

        // check the usd balance first
        const decoded = jwtDecode(req.headers.authorization)
        const client = await Client.retrieveClientInfo(decoded.email)
        const transfer = req.body

        if (client.USD_balance <= 0) {
            res.status(401)
                .json('You do not have enough usd in your account')
        }

        // retrieve client id, trader id


        const date = new Date()
        const formattedDate = `${date.getFullYear()}` + '-' + `${date.getMonth()}` + '-' + `${date.getDate()}`

        // create object for the record
        const transferCreds = {
            client_id: client.client_id,
            trader_id: client.trader_id,
            amount_paid: transfer.amount_paid,
            date: formattedDate,
            isCancelled: false,
            isInvested: false
        }


        // create record of money transfer
        const transferMoney = await Client.transerMoney(transferCreds)

        // update the usd balance of the client
        const reducedBalance = client.USD_balance - transfer.amount_paid

        const updateUSDBalance = await Client.updateUSDBalance(decoded.email, reducedBalance)

        // update the transfer account of the trader
        const updateTransferAccount = await Trader.updateTransferAccountById(client.trader_id, transfer.amount_paid)


        if (client &&
            transferMoney &&
            updateUSDBalance &&
            updateTransferAccount) {
            res.status(201)
                .json('Successfully transferred payment to trader')

        }



    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})

module.exports = router