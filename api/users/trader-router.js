const router = require('express').Router();
const Client = require('./client-model');
const { jwtDecode } = require('jwt-decode');
const Trader = require('./trader-model');


// /trader-buy-bitcoin: path to buy bitcoin for client by trader
router.post('/trader-buy-bitcoin', async (req, res, next) => {
    try {

        // retrieve details of bitcoin purchase from req body
        const pageDetails = req.body;

        // decode token from auth header
        const decoded = jwtDecode(req.headers.authorization);

        // retrieve client info using email of client
        const client = await Client.retrieveClientInfo(pageDetails.email);

        // retrieve trader info from trader email
        const trader = await Trader.retreiveTraderInfo(decoded.email);

        // retrieve the transfers of money from client to trader that have not been invested.
        let isInvested = false
        const transfersNotInvested = await Trader.retrieveTotalFromPendingTransferPayments(client.client_id, isInvested)


        // retrieve member level of client
        const memberLevel = client.mem_level;

        //convert the money retrieved, which is a string at the moment, and convert to Number type
        const convertedTransfersNotInvested = Number(transfersNotInvested[0].sum);

        // vars for commission pay for trader and remaining money after commission pay.
        let commissionPay = 0.00;
        let remainingMoney;

        // check if client membership is silver
        if (memberLevel === 'Silver') {
            // membership is silver
            // calculate the commission pay based on silver membership
            commissionPay = convertedTransfersNotInvested * 0.1;

            // calculate the remaining money by subtracting the commission pay.
            remainingMoney = convertedTransfersNotInvested - commissionPay;

        }

        // check if client membership is gold
        else if (memberLevel === 'Gold') {
            // membership is gold
            // calculate the commission pay based on gold membership
            commissionPay = convertedTransfersNotInvested * 0.05;

            // calculate the remaining money by subtracting the commission pay.
            remainingMoney = convertedTransfersNotInvested - commissionPay;
        }

        // calculate how much bitcoin can be purchased with the remaining
        // amount of money left over after commission
        const currentBitcoin = Number(client.Bitcoin_balance);
        const convertedBitcoinPrice = Number(pageDetails.Bitcoin_price);

        // this is the current bitcoin the client possess + the amount of bitcoin
        // that can be purchased.
        let updatedBitcoin = currentBitcoin + (remainingMoney / convertedBitcoinPrice);


        // Insert the updated bitcoin 
        const updateBitcoin = await Client.updateBitcoinWallet(pageDetails.email,
            updatedBitcoin);

        // get today's date and format for db insertion.
        const date = new Date();
        const formattedDate = `${date.getFullYear()}` + '-' + `${date.getMonth()}` + '-' + `${date.getDate()}`;


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
        const updateTransferBalance = await Trader.updateTransferAccountById(trader.trader_id, updatedBalance)

        // update trader USD balance with commission pay
        const currentUSD = convertedTraderUSDBalance + commissionPay


        // update the trader usd balance in database and save result.
        const updateUSDBalanceOfTrader = await Trader.updateUSDBalanceOfTrader(trader.trader_id, currentUSD)

        // update the transfer records of the non invested transfers
        isInvested = true
        const notInvested = false
        const updateNonInvestedTransferRecords = await Trader.updateTransferRecords(client.client_id, notInvested, isInvested)



        // insert order into order table
        const addOrder = await Client.addOrder(orderCreds)


        // check if operations succeeded
        if (client &&
            transfersNotInvested &&
            updateBitcoin &&
            updateNumTrades &&
            updateTransferBalance &&
            updateUSDBalanceOfTrader &&
            addOrder &&
            updateNonInvestedTransferRecords &&
            trader) {
            // operations successful, send success response.
            res.status(201)
                .json({
                    message: `Successfully bought bitcoin for client`,
                    amount: (remainingMoney / pageDetails.Bitcoin_price)
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
        const pageDetails = req.body
        const decoded = jwtDecode(req.headers.authorization)
        const client = await Client.retrieveClientInfo(pageDetails.email)
        const convertedBitcoinBalance = Number(pageDetails.Bitcoin_balance)
        const convertedBitcoinPrice = Number(pageDetails.Bitcoin_price)

        // retrieve member level of client
        const memberLevel = client.mem_level
        let commissionPay = 0.00

        // calculate commission pay
        if (memberLevel === 'Silver') {
            commissionPay = (convertedBitcoinBalance) * 0.1
        }
        else if (memberLevel === 'Gold') {
            commissionPay = (convertedBitcoinBalance) * 0.05
        }



        // if current bitcoin balance is less than what the client wants sold reject otherwise proceed
        if (client.Bitcoin_balance < convertedBitcoinBalance ||
            isNaN(client.Bitcoin_balance) || client.Bitcoin_balance < 0) {
            res.status(401)
                .json('client does not possess enough bitcoin in account to make sale')

        }
        else if (client.Bitcoin_balance < (convertedBitcoinBalance + commissionPay) ||
            isNaN(client.Bitcoin_balance) || client.Bitcoin_balance < 0) {
            res.status(401)
                .json('client does not possess enough bitcoin in account to make purchase and commission')

        }
        else {
            //  update bitcoin amount of client
            const currentBitcoin = client.Bitcoin_balance
            let updatedBitcoin = currentBitcoin -
                convertedBitcoinBalance


            // Insert the updated bitcoin for client
            const updateBitcoin = await Client.updateBitcoinWallet(decoded.email,
                updatedBitcoin)

            // calculate the remaining bitcoin dollar amount
            // after trader takes commission
            const remainingUSD = (convertedBitcoinPrice * convertedBitcoinBalance) - (commissionPay * convertedBitcoinPrice)

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
                Bitcoin_balance: convertedBitcoinBalance,
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
                        amount: convertedBitcoinBalance
                    })
            }

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
