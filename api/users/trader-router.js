const router = require('express').Router()
const Client = require('./client-model')
const { default: jwtDecode } = require('jwt-decode')
const { restricted, checkIfPasswordExists } = require('../auth/auth-middleware')
const Trader = require('./trader-model')





// path to buy bitcoin for client 
router.post('/BuyBitcoin', restricted, async (req, res, next) => {
    try {
        const pageDetails = req.body
        const decoded = jwtDecode(req.headers.authorization)
        const client = await Client.retrieveClientInfo(pageDetails.client_email)
        let isInvested = false
        const transfersNotInvested = await Trader.retrieveTotalFromPendingTransferPayments(client.client_id, isInvested)


        // retrieve member level of client
        const memberLevel = client.mem_level
        let commissionPay = 0.00

        // calculate commission pay
        if (memberLevel === 'Silver') {
            commissionPay = (pageDetails.Bitcoin_balance * pageDetails.Bitcoin_price) * 0.1
        }
        else if (memberLevel === 'Gold') {
            commissionPay = (pageDetails.Bitcoin_balance * pageDetails.Bitcoin_price) * 0.05
        }




        // Check to see of the non invested money equals the purchase amount
        if (transfersNotInvested ===
            (pageDetails.Bitcoin_balance * pageDetails.bitcoin_price)) {
            res.status(401)
                .json('Trader has enough for purchase but not for purchase and commission')
        }
        else if (transfersNotInvested <
            (pageDetails.Bitcoin_balance * pageDetails.bitcoin_price)) {
            res.status(401)
                .json('Trader does not have enough for purchase and commission')

        }
        else if (transfersNotInvested <
            (pageDetails.Bitcoin_balance * pageDetails.bitcoin_price) + commissionPay) {
            res.status(401)
                .json('Trader does not have enough for purchase and commission')


        }
        else if (transfersNotInvested >
            (pageDetails.Bitcoin_balance * pageDetails.bitcoin_price) + commissionPay) {
            res.status(401)
                .json('Trader must invest all of clients transfer money')


        }
        else {
            //  update bitcoin amount of client


            const currentBitcoin = client.Bitcoin_balance
            let updatedBitcoin = currentBitcoin +
                pageDetails.Bitcoin_balance


            // Insert the updated bitcoin 
            const updateBitcoin = await Client.updateBitcoinWallet(decoded.email,
                updatedBitcoin)


            // create object for record of order
            const orderCreds = {
                client_id: client.client_id,
                date: Date(),
                comm_paid: commissionPay,
                comm_type: 'USD',
                Bitcoin_balance: pageDetails.Bitcoin_balance

            }

            // increment trades by 1 and update number of client trades
            // Trader transactions count as a client trades
            const incrementedTrades = (client.num_trades + 1)
            const updateNumTrades = await Client.updateNumTrades(client.email, incrementedTrades)

            // Update trader transfer balance
            const traderId = await Client.findTraderID(client.client_id)
            const trader = await Trader.retreiveTraderInfo(decoded.email)
            let updatedBalance = trader.transfer_balance - transfersNotInvested
            const updateTransferBalance = await Trader.updateTransferAccountById(traderId, updatedBalance)

            // update trader USD balance with commission pay
            const currentUSD = trader.USD_balance + commissionPay
            const updateUSDBalanceOfTrader = await Trader.updateUSDBalanceOfTrader(traderId, currentUSD)

            // update the transfer records of the non invested transfers
            isInvested = true
            const notInvested = false
            const updateNonInvestedTransferRecords = await Trader.updateTransferRecords(client.client_id, notInvested, isInvested)


            // insert order into order table
            const addOrder = await Client.addOrder(orderCreds)

            // consolidate all database ops into single object for json
            const dataOps = {
                client,
                transfersNotInvested,
                updateBitcoin,
                updateNumTrades,
                traderId,
                updateTransferBalance,
                updateUSDBalanceOfTrader,
                addOrder,
                updateNonInvestedTransferRecords,
                trader
            }

            if (dataOps) {
                res.status(201)
                    .json(dataOps)
            }

        }


    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})


// path to sell bitcoin by trader
router.post('/SellBitcoin', restricted, async (req, res, next) => {
    try {
        const pageDetails = req.body
        const decoded = jwtDecode(req.headers.authorization)
        const client = await Client.retrieveClientInfo(pageDetails.client_email)



        // retrieve member level of client
        const memberLevel = client.mem_level
        let commissionPay = 0.00

        // calculate commission pay
        if (memberLevel === 'Silver') {
            commissionPay = (pageDetails.Bitcoin_balance) * 0.1
        }
        else if (memberLevel === 'Gold') {
            commissionPay = (pageDetails.Bitcoin_balance) * 0.05
        }



        // if current bitcoin balance is less than what the client wants sold reject otherwise proceed
        if (client.Bitcoin_balance < pageDetails.Bitcoin_balance) {
            res.status(401)
                .json('client does not possess enough bitcoin in account to make sale')

        }
        else if (client.Bitcoin_balance < (pageDetails.Bitcoin_balance + commissionPay)) {
            res.status(401)
                .json('client does not possess enough bitcoin in account to make purchase and commission')

        }
        else {
            //  update bitcoin amount of client
            const currentBitcoin = client.Bitcoin_balance
            let updatedBitcoin = currentBitcoin -
                pageDetails.Bitcoin_balance


            // Insert the updated bitcoin for client
            const updateBitcoin = await Client.updateBitcoinWallet(decoded.email,
                updatedBitcoin)


            // create object for record of order
            const orderCreds = {
                client_id: client.client_id,
                date: Date(),
                comm_paid: commissionPay,
                comm_type: 'Bitcoin',
                Bitcoin_balance: pageDetails.Bitcoin_balance

            }

            // increment trades by 1 and update number of client trades
            // Trader transactions count as a client trade
            const incrementedTrades = (client.num_trades + 1)
            const updateNumTrades = await Client.updateNumTrades(client.email, incrementedTrades)

            // Update trader bitcoin balance            
            const trader = await Trader.retreiveTraderInfo(decoded.email)
            const updatedTraderBitoinBalance = trader.Bitcoin_balance + commissionPay
            const updateTraderBitcoinBalance = await Trader.updateBitcoinBalanceOfTrader(trader.trader_id, updatedTraderBitoinBalance)







            // insert order into order table
            const addOrder = await Client.addOrder(orderCreds)

            // consolidate all database ops into single object for json
            const dataOps = {
                client,
                updateBitcoin,
                updateNumTrades,
                trader,
                updateTraderBitcoinBalance
            }

            if (dataOps) {
                res.status(201)
                    .json(dataOps)
            }

        }


    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})

// path to retrieve client in search
router.get('/clients/search', restricted, async (req, res, next) => {
    try {
        // get client search credentials
        const client = req.body
        let retrievedClient;


        // search for client based on email,fullname and email
        if (!client.first_name && !client.last_name && client.email) {
            retrievedClient = await Trader.findClientByEmail(email)

        }
        else if (client.first_name && client.last_name && client.email) {
            retrievedClient = Trader.findClientByEmailAndFullName(client)

        }
        else if (client.email) {
            retrievedClient = await Trader.findClientByEmail(email)

        }


        if (retrievedClient) {
            res.status(200)
                .json(retrievedClient)
        }

    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)

    }

})


// path to retrieve all transfer payments made by clients
// and retrieve all transactions made by the trader
router.get('/clients/:client_id/payments-and-transactions', restricted, async (req, res, next) => {

    try {
        const { client_id } = req.params
        const orders = await Client.retrievePastOrders(client_id)
        const transfers = await Trader.retrieveTransferPayments(client_id)

        const ordersAndTransfers = { orders, transfers }

        if (ordersAndTransfers) {
            res.status(200)
                .json(ordersAndTransfers)
        }

    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }

})

// path to cancel a payment or transaction
router.post('/CancelPaymentOrTransaction', restricted, async (req, res, next) => {
    try {
        const paymentOrtransfer = req.body
        let order;
        let transfer;
        const isCancelled = true

        // differentiate between order and transfer payment
        if ('comm_type' in paymentOrtransfer) {
            // update order to show that order is cancelled

            order = await Trader.updateIsCancelledOrder(paymentOrtransfer.client_id, isCancelled)
        }
        else {
            // update transfer to show that transfer is cancelled
            transfer = await Trader.updateIsCancelledTransfer(paymentOrtransfer.client_id, isCancelled)
        }
        const cancelledTransaction = await Trader.addTransacOrPayment(paymentOrtransaction)

        // consolidate data ops in single object for transacs and orders
        const cancelledTransactionAndOrders = {
            cancelledTransaction,
            order
        }

        // consolidate data ops for cancelled and transfers for single object
        const cancelledTransactionAndTransfers = {
            cancelledTransaction,
            transfer
        }

        if ((cancelledTransactionAndOrders)) {
            res.status(201)
                .json(cancelledTransactionAndOrders)
        }
        else if (cancelledTransactionAndTransfers) {
            res.status(201)
                .json(cancelledTransactionAndTransfers)

        }

    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})


module.exports = router
