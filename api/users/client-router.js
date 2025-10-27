const router = require('express').Router();
const Client = require('./client-model');
const { jwtDecode } = require('jwt-decode');
const { checkIfPasswordExists, checkIfEmailExists } = require('../auth/auth-middleware');
const Trader = require('./trader-model');
const axios = require('axios');
const User = require('./user-model');

const { processClientBuyBitcoinOrder, processClientSellBitcoinOrder } = require("./client-middleware");

// /latest: endpoint that retrieves the latest bitcoin price
router.get('/latest', async (req, res) => {
    try {


        // third party api call that retrieves the latest bitcoin price
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
            },
        });

        // The retrieves the bitcoin price from the crypto currency data that was retrieved.
        const bitcoinData = response.data.data.find(crypto => crypto.symbol === 'BTC');
        const bitcoinPrice = bitcoinData ? bitcoinData.quote.USD.price : null;

        // check if the price was successfully retrieved
        if (bitcoinPrice) {
            // successful, send success response with the btc price
            res.status(200).json({ price: bitcoinPrice });
        } else {
            // failed, send failure response.
            res.status(404).send('Bitcoin data not found');
        }
    } catch (error) {

        // internal server error, send failed response.
        res.status(500).json(`Server Error: ${error.message}`);
    }
});

// purchasing-power: endpoint that retrieves the current amount
//                 : of money in a client's account
router.get('/purchasing-power', async (req, res) => {
    try {

        //process token
        const decoded = jwtDecode(req.headers.authorization);

        // retrieve client info using email
        const client = await Client.retrieveClientInfo(decoded.email);

        // usd balance
        const balance = client.USD_balance;

        // check if retrieval was successful
        if (client) {
            // retrieval successful, send the balance
            res.status(200).json(balance);
        }



    } catch (err) {
        // internal server error send failed response
        res.status(500).json(`Server Error: ${err.message}`);
    }

})


// portfolioValue: calculates and retrieves the total usd value for bitcoin holdings
router.get('/portfolio-value', async (req, res) => {
    try {
        // process token
        const decoded = jwtDecode(req.headers.authorization);

        // retrieve client info
        const client = await Client.retrieveClientInfo(decoded.email);

        // third party api call that retrieves the latest bitcoin price
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
            },
        });

        // The retrieves the bitcoin price from the crypto currency data that was retrieved.
        const bitcoinData = response.data.data.find(crypto => crypto.symbol === 'BTC');
        const bitcoinPrice = bitcoinData ? bitcoinData.quote.USD.price : null;

        // bitcoin holdings
        const wallet = client.Bitcoin_balance;

        // calculate the portfolio total usd value
        const portfolioWorth = parseFloat(bitcoinPrice) * parseFloat(wallet);

        // check if client and response were successful
        if (client && response) {
            // success, send portfolio total worth
            res.status(200).json(portfolioWorth);
        }



    } catch (err) {
        // internal server error send failed response
        req.status(500).json(`Server Error: ${err.message}`);
    }
})


// /orders: endpoint that retrieves orders made by a client.
router.get('/orders', async (req, res) => {
    try {
        // process the token
        const decoded = jwtDecode(req.headers.authorization);

        // find the client info
        const client = await Client.retrieveClientInfo(decoded.email);

        // use the client id to retrieve the past orders of the client
        const orders = await Client.retrievePastOrders(client.client_id);

        // check if client and orders was successful
        if (client && orders) {
            // success, send success response with the orders.
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


// /buy-bitcoin: endpoint that processes a bitcoin order placed by a client
router.post('/buy-bitcoin', checkIfEmailExists, checkIfPasswordExists, processClientBuyBitcoinOrder, async (req, res, next) => {
    try {

        // get the balance
        const balance = req.balance;

        // retrieve is middleware operations were successful
        const isOpSuccessful = req.isOpSuccessful;


        // was op successful
        if (isOpSuccessful) {
            // op successful, send success response along with balance.
            res.status(201)
                .json({
                    message: 'Successfully bought bitcoin',
                    amount: balance
                })
        }
    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }

})

// /sell-bitcoin: endpoint that processes the selling of bitcoin of a client.
router.post('/sell-bitcoin', checkIfEmailExists, checkIfPasswordExists, processClientSellBitcoinOrder, async (req, res, next) => {
    try {
        // get the balance
        const balance = req.balance;

        // retrieve is middleware operations were successful
        const isOpSuccessful = req.isOpSuccessful;

        // check if op successful.
        if (isOpSuccessful) {
            // op successful send success response.
            res.status(201)
                .json({
                    message: 'successfully sold bitcoin',
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


// /bitcoin-wallet: path to retrieve bitcoin wallet of client
router.get('/bitcoin-wallet', async (req, res, next) => {
    try {
        // decode token from auth header
        const decoded = jwtDecode(req.headers.authorization);

        // retrieve the wallet from db.
        const wallet = await Client.retrieveClientInfo(decoded.email);

        //check if wallet was retrieved.
        if (wallet) {
            // wallet was retrieved, send success response with wallet.
            res.status(200)
                .json(wallet.Bitcoin_balance)
        }

    }
    catch (err) {

        // internal server error, send failure response.
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }



})


// /transfer-money: path to transfer money to trader
router.post('/transfer-money', async (req, res, next) => {
    try {

        // decode token from auth header
        const decoded = jwtDecode(req.headers.authorization);

        // retrieve client info from db using email
        const client = await Client.retrieveClientInfo(decoded.email);

        // retrieve transfer amount from req body
        const transfer = req.body;

        // check if usd is 0.
        if (parseFloat(client.USD_balance) <= 0) {
            // dont have enough usd, send failure response.
            res.status(401)
                .json('You do not have enough usd in your account')
        }



        // get the current date and format it for db insertion
        const date = new Date()
        const formattedDate = `${date.getFullYear()}` + '-' + `${date.getMonth()}` + '-' + `${date.getDate()}`

        // create object for the record
        const transferCreds = {
            client_id: client.client_id,
            trader_id: client.trader_id,
            amount_paid: parseFloat(transfer.amount_paid),
            date: formattedDate,
            isCancelled: false,
            isInvested: false
        }


        // create record of money transfer
        const transferMoney = await Client.transerMoney(transferCreds)

        // update the usd balance of the client
        const reducedBalance = parseFloat(client.USD_balance) - parseFloat(transfer.amount_paid)

        // update the usd balance in db and save result
        const updateUSDBalance = await Client.updateUSDBalance(decoded.email, reducedBalance)

        // update the transfer account of the trader
        const updateTransferAccount = await Trader.updateTransferAccountById(client.trader_id, parseFloat(transfer.amount_paid))


        // check if operations were successful
        if (client &&
            transferMoney &&
            updateUSDBalance &&
            updateTransferAccount) {

            // operations succeeded, send success response.
            res.status(201)
                .json('Successfully transferred payment to trader')

        }



    }
    catch (err) {
        // internal server error, send failure response.
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})

module.exports = router