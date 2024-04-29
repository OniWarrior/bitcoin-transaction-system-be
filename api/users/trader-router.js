const router = require('express').Router()
const Client = require('./client-model')
const { jwtDecode } = require('jwt-decode');
const { restricted } = require('../auth/auth-middleware')
const Trader = require('./trader-model')




// path to buy bitcoin for client 
router.post('/TraderBuyBitcoin', async (req, res, next) => {
    try {
        const pageDetails = req.body
        const decoded = jwtDecode(req.headers.authorization)
        const client = await Client.retrieveClientInfo(pageDetails.email)
        const trader = await Trader.retreiveTraderInfo(decoded.email)

        let isInvested = false
        const transfersNotInvested = await Trader.retrieveTotalFromPendingTransferPayments(client.client_id, isInvested)


        // retrieve member level of client
        const memberLevel = client.mem_level



        const convertedTransfersNotInvested = Number(transfersNotInvested[0].sum)
        let commissionPay = 0.00
        let remainingMoney;

        // calculate commission pay
        if (memberLevel === 'Silver') {
            commissionPay = convertedTransfersNotInvested * 0.1
            remainingMoney = convertedTransfersNotInvested - commissionPay

        }
        else if (memberLevel === 'Gold') {
            commissionPay = convertedTransfersNotInvested * 0.05
            remainingMoney = convertedTransfersNotInvested - commissionPay
        }







        // calculate how much bitcoin can be purchased with the remaining
        // amount of money left over after commission
        const currentBitcoin = Number(client.Bitcoin_balance)
        const convertedBitcoinPrice = Number(pageDetails.Bitcoin_price)

        // this is the current bitcoin the client possess + the amount of bitcoin
        // that can be purchased.
        let updatedBitcoin = currentBitcoin + (remainingMoney / convertedBitcoinPrice)


        // Insert the updated bitcoin 
        const updateBitcoin = await Client.updateBitcoinWallet(pageDetails.email,
            updatedBitcoin)

        const date = new Date()
        const formattedDate = `${date.getFullYear()}` + '-' + `${date.getMonth()}` + '-' + `${date.getDate()}`


        // create object for record of order
        const orderCreds = {
            client_id: client.client_id,
            date: formattedDate,
            comm_paid: commissionPay,
            comm_type: 'USD',
            Bitcoin_balance: (remainingMoney / convertedBitcoinPrice),
            isCancelled: false

        }

        // increment trades by 1 and update number of client trades
        // Trader transactions count as a client trades
        const incrementedTrades = Number(client.num_trades + 1)

        const updateNumTrades = await Client.updateNumTrades(pageDetails.email, incrementedTrades)
        const convertedTraderUSDBalance = Number(trader.USD_balance)

        // Update trader transfer balance        
        let updatedBalance = trader.transfer_balance - convertedTransfersNotInvested
        //const updateTransferBalance = await Trader.updateTransferAccountById(trader.trader_id, updatedBalance)

        // update trader USD balance with commission pay
        const currentUSD = convertedTraderUSDBalance + commissionPay



        const updateUSDBalanceOfTrader = await Trader.updateUSDBalanceOfTrader(trader.trader_id, currentUSD)

        // update the transfer records of the non invested transfers
        isInvested = true
        const notInvested = false
        const updateNonInvestedTransferRecords = await Trader.updateTransferRecords(client.client_id, notInvested, isInvested)
        res.status(200).json(updateNonInvestedTransferRecords)


        // insert order into order table
        const addOrder = await Client.addOrder(orderCreds)



        if (client &&
            transfersNotInvested &&
            updateBitcoin &&
            updateNumTrades &&
            updateTransferBalance &&
            updateUSDBalanceOfTrader &&
            addOrder &&
            updateNonInvestedTransferRecords &&
            trader) {
            res.status(201)
                .json({
                    message: `Successfully bought bitcoin for client`,
                    amount: (remainingMoney / pageDetails.Bitcoin_price)
                })
        }




    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})


// path to sell bitcoin by trader
router.post('/TraderSellBitcoin', async (req, res, next) => {
    try {
        const pageDetails = req.body
        const decoded = jwtDecode(req.headers.authorization)
        const client = await Client.retrieveClientInfo(pageDetails.email)



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
        if (client.Bitcoin_balance < pageDetails.Bitcoin_balance ||
            isNaN(client.Bitcoin_balance) || client.Bitcoin_balance < 0) {
            res.status(401)
                .json('client does not possess enough bitcoin in account to make sale')

        }
        else if (client.Bitcoin_balance < (pageDetails.Bitcoin_balance + commissionPay) ||
            isNaN(client.Bitcoin_balance) || client.Bitcoin_balance < 0) {
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

            // calculate the remaining bitcoin dollar amount
            // after trader takes commission
            const remainingUSD = (pageDetails.Bitcoin_price * pageDetails.Bitcoin_balance) - (commissionPay * pageDetails.Bitcoin_price)

            // update the usd balance for client
            const updateUSDBalance = await Client.updateUSDBalance(client.email, remainingUSD)

            const date = new Date()
            const formattedDate = `${date.getFullYear()}` + '-' + `${date.getMonth()}` + '-' + `${date.getDate()}`


            // create object for record of order
            const orderCreds = {
                client_id: client.client_id,
                date: formattedDate,
                comm_paid: commissionPay,
                comm_type: 'Bitcoin',
                Bitcoin_balance: pageDetails.Bitcoin_balance,
                isCancelled: false

            }



            // increment trades by 1 and update number of client trades
            // Trader transactions count as a client trade
            const incrementedTrades = (client.num_trades + 1)
            const updateNumTrades = await Client.updateNumTrades(client.email, incrementedTrades)

            // Update trader bitcoin balance            
            const trader = await Trader.retreiveTraderInfo(decoded.email)
            const updatedTraderBitoinBalance = Number(trader.Bitcoin_balance) + Number(commissionPay)


            const updateTraderBitcoinBalance = await Trader.updateBitcoinBalanceOfTrader(trader.trader_id, updatedTraderBitoinBalance)







            // insert order into order table
            const addOrder = await Client.addOrder(orderCreds)



            if (addOrder &&
                client &&
                updateBitcoin &&
                updateNumTrades &&
                trader &&
                updateTraderBitcoinBalance &&
                updateUSDBalance) {
                res.status(201)
                    .json({
                        message: 'Successfully sold Bitcoin',
                        amount: pageDetails.Bitcoin_balance
                    })
            }

        }


    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})

// path to retrieve client in search
router.post('/clients/search', async (req, res, next) => {
    try {
        // get client search credentials
        const client = req.body
        let retrievedClient;


        // search for client based on email,fullname and email
        if (!client.first_name && !client.last_name && client.email) {
            retrievedClient = await Trader.findClientByEmail(client.email)

        }
        else if (client.first_name && client.last_name && client.email) {
            retrievedClient = await Trader.findClientByEmailAndFullName(client)

        }
        else if (client.email) {
            retrievedClient = await Trader.findClientByEmail(client.email)

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

// path to retrieve all records in the cancel log
router.get('/cancel-log', async (req, res, next) => {
    try {
        const decoded = jwtDecode(req.headers.authorization)
        const trader = await Trader.retreiveTraderInfo(decoded.email)
        const cancelLog = await Trader.retrieveCancelLog(trader.trader_id)
        if (trader && cancelLog) {
            res.status(200).json(cancelLog)
        }

    }
    catch (err) {
        res.status(500).json(`Server Error: ${err.message}`)
    }
})

// path to retrieve all transfer payments made by clients
// and retrieve all transactions made by the trader
router.get('/clients/:client_id/payments-and-transactions', async (req, res, next) => {

    try {
        const { client_id } = req.params
        const orders = await Client.retrievePastOrders(client_id)
        const transfers = await Trader.retrieveTransferPayments(client_id)



        if (orders && transfers) {
            res.status(200)
                .json({
                    orders: orders,
                    transfers: transfers
                })
        }

    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }

})

// path to cancel a payment or transaction
router.put('/CancelPaymentOrTransaction', async (req, res, next) => {
    try {
        const decoded = jwtDecode(req.headers.authorization)
        const trader = await Trader.retreiveTraderInfo(decoded.email)
        const paymentOrtransfer = req.body
        let order;
        let transfer;

        const isCancelled = true

        // differentiate between order and transfer payment
        if ('comm_type' in paymentOrtransfer) {
            // update order to show that order is cancelled

            order = await Trader.updateIsCancelledOrder(paymentOrtransfer.order_id, isCancelled, trader.trader_id)

        }
        else {
            // update transfer to show that transfer is cancelled
            transfer = await Trader.updateIsCancelledTransfer(paymentOrtransfer.transac_id, isCancelled)
        }

        paymentOrtransfer.isCancelled = true
        const cancelledTransaction = await Trader.addTransacOrPayment(paymentOrtransfer)





        if ((cancelledTransaction &&
            order && trader)) {
            res.status(201)
                .json({
                    cancelledTransaction: cancelledTransaction,
                    cancelledOrder: order
                })
        }
        else if (cancelledTransaction &&
            transfer && trader) {
            res.status(201)
                .json({
                    cancelledTransaction: cancelledTransaction,
                    cancelledTransfer: transfer
                })

        }

    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})


module.exports = router
