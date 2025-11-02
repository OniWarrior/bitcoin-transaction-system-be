const { jwtDecode } = require('jwt-decode');
const Client = require('./client-model.js');
const Trader = require('./trader-model');


// processClientBuyBitcoinOrder: process bitcoin purchase made buy a client.
const processClientBuyBitcoinOrder = async (req, res, next) => {
    // decode the token of a client
    const decoded = jwtDecode(req.headers.authorization);

    // collect the order in the request body
    const order = req.body;

    // retrieve the client info based on the client email in the decoded token.
    const client = await Client.retrieveClientInfo(decoded.email);

    // vars of converted strings to floats
    const cBalance = parseFloat(client.USD_balance);
    const cBTC = parseFloat(client.Bitcoin_balance);
    const btcAmount = parseFloat(order.Bitcoin_balance);
    const btcPrice = parseFloat(order.Bitcoin_price);


    // Check balance to see if enough money exists to purchase bitcoin
    if (cBalance <
        (btcAmount * btcPrice) ||
        isNaN(cBalance) || cBalance < 0) {
        return res.status(401)
            .json('Client does not possess enough currency in account to make purchase')
    }

    // Update balance and update bitcoin amount
    let updatedBalance = cBalance - (btcAmount * btcPrice);
    const currentBitcoin = cBTC;
    let updatedBitcoin = currentBitcoin + btcAmount;


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
            commissionPay = (btcAmount * btcPrice) * 0.1;


            // reject if client doesn't possess enough money
            if (cBalance < (btcAmount * btcPrice) + commissionPay) {
                return res.status(401)
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
            commissionPay = (btcAmount * btcPrice) * 0.05;

            // reject if client doesn't possess enough money
            if (cBalance < ((btcAmount * btcPrice) + commissionPay)) {
                return res.status(401)
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

            commissionPay = (btcAmount) * 0.1;


            // reject if client doesn't possess enough money
            if (cBTC < commissionPay) {
                return res.status(401)
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
            commissionPay = (btcAmount) * 0.05
            // reject if client doesn't possess enough money
            if (cBTC < commissionPay) {
                return res.status(401)
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
    const formattedDate = `${date.getFullYear()}` + '-' + `${date.getMonth() + 1}` + '-' + `${date.getDate()}`

    // create object for record of order
    const orderCreds = {
        client_id: client.client_id,
        date: formattedDate,
        comm_paid: commissionPay,
        comm_type: order.comm_type,
        Bitcoin_balance: btcAmount,
        isCancelled: false

    }

    // increment trades by 1 and update number of client trades
    const incrementedTrades = (client.num_trades + 1)
    const updateNumTrades = await Client.updateNumTrades(client.email, incrementedTrades)


    // insert order into order table
    const addOrder = await Client.addOrder(orderCreds)

    if (order.comm_type === 'USD') {

        // retrieve current usd balance of trader
        const traderInfo = await Trader.retreiveTraderInfoById(client.trader_id);
        const traderUSD = parseFloat(traderInfo.USD_balance);

        // update the usd dollar balance of the trader by adding current balance to comm pay
        const updateUSDBalanceOfTrader = await Trader.updateUSDBalanceOfTrader(client.trader_id, commissionPayUSD + traderUSD)

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
            req.balance = btcAmount;
            next();
        }
    }
    else if (order.comm_type === 'Bitcoin') {

        // retrieve current btc of trader
        const traderInfo = await Trader.retreiveTraderInfoById(client.trader_id);
        const traderBTC = parseFloat(traderInfo.Bitcoin_balance);

        // update bitcoin balance of the trader by adding current btc to comm pay
        const updateBitcoinBalanceOfTrader = await Trader.updateBitcoinBalanceOfTrader(client.trader_id, traderBTC + commissionPayBitcoin)


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
            req.balance = btcAmount;
            next();
        }
    }







}

// processClientSellBitcoinOrder: process the selling of bitcoin by a client 
const processClientSellBitcoinOrder = async (req, res, next) => {

    // decode token
    const decoded = jwtDecode(req.headers.authorization);

    // retrieve the order from request body
    const order = req.body

    // retrieve client info
    const client = await Client.retrieveClientInfo(decoded.email);

    // vars of converted strings to floats
    const cBalance = parseFloat(client.USD_balance);
    const cBTC = parseFloat(client.Bitcoin_balance);
    const btcAmount = parseFloat(order.Bitcoin_balance);
    const btcPrice = parseFloat(order.Bitcoin_price)

    // retrieve current bitcoin balance and check to see if sale can be made
    if (cBTC < btcAmount || isNaN(cBTC) || cBTC < 0) {
        // not enough, send failure response
        return res.status(401)
            .json('Client does not posses enough bitcoin to perform sell')

    }
    else { // Theres enough in client account

        // update balance of bitcoin and balance of usd
        let updatedBitcoin = cBTC - btcAmount;
        let updatedBalance = cBalance + (btcAmount * btcPrice);

        // set up vars for commission pay calculations of trader.
        let commissionPay = 0.00
        let commissionPayUSD;
        let commissionPayBitcoin;

        // update balance or bitcoin balance based on selection
        // of how client wants to pay commission
        if (order.comm_type === 'USD') {
            // check if the membership level is silver
            if (client.mem_level === 'Silver') {

                // calculate commission pay based on silver membership
                commissionPay = (btcAmount * btcPrice) * 0.1;

                // check the usd balance of client
                if (cBalance < commissionPay) {

                    // client doesn't have enough usd, send failure response.
                    return res.status(401)
                        .json('Client does not possess enough fiat USD to pay commission')
                }
                else {

                    // update balance of client by subtracting commission pay from current balance

                    updatedBalance -= commissionPay;


                    // assign commission pay to trader
                    commissionPayUSD = commissionPay;

                }

            }

            // check if membership is gold
            else if (client.mem_level === 'Gold') {

                // calculate commission pay based on gold membership
                commissionPay = (btcAmount * btcPrice) * 0.05;

                // check client's usd balance
                if (cBalance < commissionPay) {

                    // not enough usd, send failure response.
                    return res.status(401)
                        .json('Client does not possess enough fiat USD to pay commission')
                }
                else {
                    // there is enough usd
                    // update client balance
                    updatedBalance -= commissionPay;

                    // assign commission pay to trader
                    commissionPayUSD = commissionPay;

                }

            }

        }

        // check if commission type is bitcoin
        else if (order.comm_type === 'Bitcoin') {
            // it is bitcoin.

            // check if membership is silver
            if (client.mem_level === 'Silver') {

                // calculate the commission pay based on silver membership.
                commissionPay = (btcAmount) * 0.1;

                // check if client has enough bitcoin in account
                if (cBTC < commissionPay) {
                    // does not have enough bitcoin, send failure response.
                    return res.status(401)
                        .json('Client does not possess enough bitcoin to pay commission')
                }
                else {
                    // the client does have enough

                    // update bitcoin balance of client
                    updatedBitcoin -= commissionPay;

                    // assign commission pay to trader.
                    commissionPayBitcoin = commissionPay

                }

            }

            // check if the client membership is gold 
            else if (client.mem_level === 'Gold') {
                // it is gold, calculate the commission pay based on gold membership
                commissionPay = (btcAmount) * 0.05;

                // check if the client has enough bitcoin
                if (cBTC < commissionPay) {
                    // not enough bitcoin, send failure response.
                    return res.status(401)
                        .json('Client does not possess enough bitcoin to pay commission')
                }
                else {// the client does have enough bitcoin

                    // update current bitcoin balance
                    updatedBitcoin -= commissionPay;

                    // assign commission pay to trader
                    commissionPayBitcoin = commissionPay;

                }

            }
        }


        // insert balance and bitcoin into tables to update
        const updateBitcoin = await Client.updateBitcoinWallet(decoded.email,
            updatedBitcoin)
        const updateUSD = await Client.updateUSDBalance(decoded.email,
            updatedBalance)
        const date = new Date()
        const formattedDate = `${date.getFullYear()}` + '-' + `${date.getMonth() + 1}` + '-' + `${date.getDate()}`

        // create object for record of order
        const orderCreds = {
            client_id: client.client_id,
            date: formattedDate,
            comm_paid: commissionPay,
            comm_type: order.comm_type,
            Bitcoin_balance: btcAmount,
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

        // check if the commission type is usd
        if (order.comm_type === 'USD') {

            // retrieve current usd balance of trader
            const traderInfo = await Trader.retreiveTraderInfoById(client.trader_id);
            const traderUSD = parseFloat(traderInfo.USD_balance);

            // it is usd update the balance of trader and save result
            updateUSDBalanceOfTrader = await Trader.updateUSDBalanceOfTrader(client.trader_id, traderUSD + commissionPayUSD)

            // check if all operations succeeded.
            if (addOrder &&
                client &&
                updateBitcoin &&
                updateUSD &&
                updateNumTrades &&
                updateUSDBalanceOfTrader) {
                // assign variables in request  to tell that all ops succeeded and the bitcoin balance.
                req.isOpSuccessful = true;
                req.balance = order.Bitcoin_balance;
                next();
            }
        }
        // check if commission type is bitcoin
        else if (order.comm_type === 'Bitcoin') {

            // retrieve current btc of trader
            const traderInfo = await Trader.retreiveTraderInfoById(client.trader_id);
            const traderBTC = parseFloat(traderInfo.Bitcoin_balance);

            // it is bitcoin update the bitcoin balance of trader in database and save result.
            updateBitcoinBalanceOfTrader = await Trader.updateBitcoinBalanceOfTrader(client.trader_id, commissionPayBitcoin + traderBTC)

            // check if all operations succeeded
            if (addOrder &&
                client &&
                updateBitcoin &&
                updateUSD &&
                updateNumTrades &&
                updateBitcoinBalanceOfTrader) {
                // assign variables in request  to tell that all ops succeeded and the bitcoin balance.
                req.isOpSuccessful = true;
                req.balance = order.Bitcoin_balance;
                next();
            }
        }


    }

}

module.exports = {
    processClientBuyBitcoinOrder,
    processClientSellBitcoinOrder
};