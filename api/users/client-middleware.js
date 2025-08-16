const { JWT_SECRET } = require('../secrets/secret.js');
const jwt = require('jsonwebtoken');
const User = require('./user-model.js');
const Client = require('./client-model.js');

// processClientBuyBitcoinOrder: process bitcoin purchase made buy a client.
const processClientBuyBitcoinOrder = async (req, res, next) => {
    // decode the token of a client
    const decoded = jwtDecode(req.headers.authorization);

    // collect the order in the request body
    const order = req.body;

    // retrieve the client info based on the client email in the decoded token.
    const client = await Client.retrieveClientInfo(decoded.email);

    // Check balance to see if enough money exists to purchase bitcoin
    if (client.USD_balance <
        (order.Bitcoin_balance * order.Bitcoin_price) ||
        isNaN(client.USD_balance) || client.USD_balance < 0) {
        res.status(401)
            .json('Client does not possess enough currency in account to make purchase')
    }

    // Update balance and update bitcoin amount
    let updatedBalance = client.USD_balance -
        (order.Bitcoin_balance * order.Bitcoin_price);
    const currentBitcoin = client.Bitcoin_balance;
    let updatedBitcoin = currentBitcoin + order.Bitcoin_balance;


    // retrieve member level of client
    const memberLevel = client.mem_level;

    // vars for the commission pay, commission currency type, and commission bitcoin that will
    // be given to the trader of the client.
    let commissionPay = 0.00
    let commissionPayUSD;
    let commissionPayBitcoin;


    // Update balance according to choice made
    // by client on how to pay for commission payment
    if (order.comm_type === 'USD') {
        // calculate commission pay based on member level
        if (memberLevel === 'Silver') {
            // calculate commission pay for silver level membership
            commissionPay = (order.Bitcoin_balance * order.Bitcoin_price) * 0.1;


            // reject if client doesn't possess enough money
            if (client.USD_balance <
                ((order.Bitcoin_balance * order.Bitcoin_price) +
                    commissionPay)) {
                res.status(401)
                    .json('Client does not possess enough fiat USD to make purchase')
            }
            else { // client does have enough money

                // update the client balance
                updatedBalance -= commissionPay;

                // update the commission for the trader
                commissionPayUSD = commissionPay;

            }

        }
        else if (memberLevel === 'Gold') {
            // calculate commission pay for gold member level
            commissionPay = (order.Bitcoin_balance * order.Bitcoin_price) * 0.05;

            // reject if client doesn't possess enough money
            if (client.USD_balance <
                ((order.Bitcoin_balance * order.Bitcoin_price) +
                    commissionPay)) {
                res.status(401)
                    .json('Client does not possess enough fiat USD to make purchase')
            }
            else {
                // update client balance for commission pay
                updatedBalance -= commissionPay;

                // assign commission pay for the trader.
                commissionPayUSD = commissionPay;

            }

        }

    }
    else if (order.comm_type === 'Bitcoin') {
        // calculate commission pay based on member level
        if (memberLevel === 'Silver') {

            commissionPay = (order.Bitcoin_balance) * 0.1;


            // reject if client doesn't possess enough money
            if (client.Bitcoin_balance < commissionPay) {
                res.status(401)
                    .json('Client does not possess enough bitcoin to make purchase')
            }
            else {

                // client has enough money
                // update balance to pay commission for trader.
                updatedBalance -= commissionPay;

                // assign commission pay for trader.
                commissionPayBitcoin = commissionPay;

            }

        }
        else if (memberLevel === 'Gold') {
            // calculate pay based on gold membership level.
            commissionPay = (order.Bitcoin_balance) * 0.05
            // reject if client doesn't possess enough money
            if (client.Bitcoin_balance < commissionPay) {
                res.status(401)
                    .json('Client does not possess enough bitcoin to make purchase')
            }
            else {
                // client has enough money
                // update balance for commission pay for trader.
                updatedBalance -= commissionPay;

                // assign commission pay for trader.
                commissionPayBitcoin = commissionPay;

            }

        }

    }


    // Insert the updated bitcoin and usd balance to database account
    const updateBitcoin = await Client.updateBitcoinWallet(decoded.email,
        updatedBitcoin)
    const updateUSD = await Client.updateUSDBalance(decoded.email,
        updatedBalance)

    // capture today's date and format it for the database insertion.
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
        // update the usd dollar balance of the trader
        updateUSDBalanceOfTrader = await Trader.updateUSDBalanceOfTrader(client.trader_id, commissionPayUSD)

        // check if all operations succeeded.
        if (addOrder &&
            client &&
            updateBitcoin &&
            updateUSD &&
            updateNumTrades &&
            updateUSDBalanceOfTrader

        ) {
            // assign variables in request  to tell that all ops succeeded and the bitcoin balance.
            req.isOpSuccessful = true;
            req.balance = order.Bitcoin_balance;
            next();
        }
    }
    else if (order.comm_type === 'Bitcoin') {
        // update bitcoin balance of the trader
        updateBitcoinBalanceOfTrader = await Trader.updateBitcoinBalanceOfTrader(client.trader_id, commissionPayBitcoin)


        // check if all operations succeeded.
        if (addOrder &&
            client &&
            updateBitcoin &&
            updateUSD &&
            updateNumTrades &&
            updateBitcoinBalanceOfTrader

        ) {
            // assign variables in request  to tell that all ops succeeded and the bitcoin balance.
            req.isOpSuccessful = true;
            req.balance = order.Bitcoin_balance;
            next();
        }
    }







}

module.exports = {
    processClientBuyBitcoinOrder
};