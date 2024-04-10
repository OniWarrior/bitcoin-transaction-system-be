const router = require('express').Router()
const Client = require('./client-model')
const { default: jwtDecode } = require('jwt-decode')
const { restricted, checkIfPasswordExists } = require('../auth/auth-middleware')
const Trader = require('./trader-model')



// path to retrieve all transfers of a particular client
router.get('/GetTransfers', restricted, async (req, res, next) => {
    try {

    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }


})

// path to buy bitcoin for client 
router.post('/BuyBitcoin', restricted, async (req, res, next) => {
    try {
        const pageDetails = req.body
        const decoded = jwtDecode(req.headers.authorization)
        const trader = await Trader.retreiveTraderInfo(decoded.email)
        const client = await Client.retrieveClientInfo(pageDetails.client_email)


        // Check balance to see if enough money exists to purchase bitcoin


        if (trader.transfer_balance <
            (pageDetails.Bitcoin_balance * pageDetails.bitcoin_price)) {
            res.status(401)
                .json('Trader does not possess enough USD in transfer account to make purchase')
        }
        else {
            // Update balance and update bitcoin amount
            let updatedBalance = trader.transfer_balance -
                (pageDetails.Bitcoin_balance *
                    pageDetails.bitcoin_price)
            const currentBitcoin = client.Bitcoin_balance
            let updatedBitcoin = currentBitcoin +
                pageDetails.Bitcoin_balance


            // retrieve member level of client
            const memberLevel = client.mem_level
            let commissionPay = 0.00




            // calculate commission pay based on member level
            if (memberLevel === 'Silver') {
                commissionPay = (pageDetails.Bitcoin_balance * pageDetails.Bitcoin_price) * 0.1


                // reject if not enough is present in transfer doesn't possess enough money
                if (trader.transfer_balance <
                    ((pageDetails.Bitcoin_balance * pageDetails.bitcoin_price) +
                        commissionPay)) {
                    res.status(401)
                        .json('Client does not possess enough fiat USD to make purchase')
                }
                else {
                    updatedBalance -= commissionPay


                }

            }
            else if (memberLevel === 'Gold') {
                commissionPay = (pageDetails.Bitcoin_balance * pageDetails.Bitcoin_price) * 0.05

                // reject if client doesn't possess enough money
                if (trader.transfer_balance <
                    ((pageDetails.Bitcoin_balance * pageDetails.bitcoin_price) +
                        commissionPay)) {
                    res.status(401)
                        .json('Client does not possess enough fiat USD to make purchase')
                }
                else {
                    updatedBalance -= commissionPay


                }

            }

            // Insert the updated bitcoin 
            const updateBitcoin = await Client.updateBitcoinWallet(decoded.email,
                updatedBitcoin)


            // create object for record of order
            const orderCreds = {
                client_id: client.client_id,
                date: Date(),
                comm_paid: commissionPay,
                comm_type: 'USD',
                Bitcoin_balance: order.Bitcoin_balance

            }

            // increment trades by 1 and update number of client trades
            const incrementedTrades = (client.num_trades + 1)
            const updateNumTrades = await Client.updateNumTrades(client.email, incrementedTrades)

            // Update trader balance--based on comm_type
            const traderId = await Client.findTraderID(client.client_id)
            let updateUSDBalanceOfTrader;


            // insert order into order table
            const addOrder = await Client.addOrder(orderCreds)

            if (client.comm_type === 'USD') {
                updateUSDBalanceOfTrader = await Trader.updateUSDBalanceOfTrader(traderId, commissionPayUSD)

                if (addOrder &&
                    client &&
                    updateBitcoin &&
                    updateUSD &&
                    updateNumTrades &&
                    traderId &&
                    updateUSDBalanceOfTrader) {
                    res.status(201)
                        .json(addOrder,
                            client,
                            updateBitcoin,
                            updateUSD,
                            updateNumTrades,
                            traderId,
                            updateUSDBalanceOfTrader)
                }
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

        if ((cancelledTransaction &&
            order)) {
            res.status(201)
                .json(cancelledTransaction, order)
        }
        else if (cancelledTransaction && transfer) {
            res.status(201)
                .json(cancelledTransaction, transfer)

        }

    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})


module.exports = router
