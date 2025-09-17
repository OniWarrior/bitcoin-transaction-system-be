const router = require('express').Router();
const Client = require('./client-model');
const { jwtDecode } = require('jwt-decode');
const Trader = require('./trader-model');
const { processTraderBuyBitcoinOrder } = require('./trader-middleware');


// /trader-buy-bitcoin: path to buy bitcoin for client by trader
router.post('/trader-buy-bitcoin', processTraderBuyBitcoinOrder, async (req, res, next) => {
    try {

        // get the balance
        const balance = req.balance;

        // retrieve is middleware operations were successful
        const isOpSuccessful = req.isOpSuccessful;


        // check if operations succeeded
        if (isOpSuccessful) {
            // operations successful, send success response.
            res.status(201)
                .json({
                    message: `Successfully bought bitcoin for client`,
                    amount: balance
                })
        }

    }
    catch (err) {
        // internal server error, send failure response.
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})


// /trader-sell-bitcoin: path to sell bitcoin by trader for client
router.post('/trader-sell-bitcoin', async (req, res, next) => {
    try {
        // get the balance
        const balance = req.balance;

        // retrieve is middleware operations were successful
        const isOpSuccessful = req.isOpSuccessful;


        // check if the ops were successful
        if (isOpSuccessful) {
            res.status(201)
                .json({
                    message: 'Successfully sold Bitcoin',
                    amount: balance
                })
        }

    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})

// /clients/search: path to retrieve client in search
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

        // check if op succeeded
        if (retrievedClient) {
            // send success response.
            res.status(200)
                .json(retrievedClient)
        }

    }
    catch (err) {
        // internal server error, send failure response.
        res.status(500)
            .json(`Server Error: ${err.message}`)

    }

})

// path to retrieve all records in the cancel log
router.get('/cancel-log', async (req, res, next) => {
    try {

        // decode the token from auth header
        const decoded = jwtDecode(req.headers.authorization);

        // get trader info using email
        const trader = await Trader.retreiveTraderInfo(decoded.email);

        // get the cancel log from db using trader id
        const cancelLog = await Trader.retrieveCancelLog(trader.trader_id);

        // check if ops succeeded
        if (trader && cancelLog) {
            // send success response.
            res.status(200).json(cancelLog)
        }

    }
    catch (err) {
        res.status(500).json(`Server Error: ${err.message}`)
    }
})



//path to retrieve all orders made by clients
router.get('/clients/:client_id/transactions', async (req, res, next) => {

    try {
        // get the client id from params
        const { client_id } = req.params;

        // get the past orders using client id
        const orders = await Client.retrievePastOrders(client_id);

        // check if op succeeded.
        if (orders) {
            // send success response.
            res.status(200)
                .json(orders)
        }

    }
    catch (err) {
        // internal server error, send failure response.
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }

})

//path to retrieve all transfers made by clients
router.get('/clients/:client_id/payments', async (req, res, next) => {

    try {

        // get the client id from req params
        const { client_id } = req.params;

        // get the transfers using client id.
        const transfers = await Trader.retrieveTransferPayments(client_id);

        // check if op succeeded.
        if (transfers) {
            // send success response.
            res.status(200)
                .json(transfers)
        }

    }
    catch (err) {
        // internal server error, send failure response.
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }

})



// /cancel-payment-or-transaction: path to cancel a payment or money transfer
router.put('/cancel-payment-or-transfer', async (req, res, next) => {
    try {

        // decode token from auth header.
        const decoded = jwtDecode(req.headers.authorization);

        // get the trader info with email
        const trader = await Trader.retreiveTraderInfo(decoded.email);

        // get the payment or money transfer from req body
        const paymentOrtransfer = req.body;

        // vars for order and transfer
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

        // add cancelled payment or transfer to db and save result.
        paymentOrtransfer.isCancelled = true
        const cancelledTransaction = await Trader.addTransacOrPayment(paymentOrtransfer)




        // check if cancelled transaction, order, and trader ops succeeded
        if ((cancelledTransaction &&
            order && trader)) {
            // send success response.
            res.status(201)
                .json({
                    cancelledTransaction: cancelledTransaction,
                    cancelledOrder: order
                })
        }

        // check if cancelled transaction, transfer, and trader ops succeeded
        else if (cancelledTransaction &&
            transfer && trader) {
            // send success response.
            res.status(201)
                .json({
                    cancelledTransaction: cancelledTransaction,
                    cancelledTransfer: transfer
                })

        }

    }
    catch (err) {
        // internal server error, send failure response.
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})


module.exports = router
