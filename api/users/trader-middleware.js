/*
 * Author: Stephen Aranda
 * File  : trader-middleware.js
 * Desc  : middleware for the processing buying and selling of bitcoin purchases
 *  */

const { jwtDecode } = require('jwt-decode');
const Client = require('./client-model.js');
const Trader = require('./trader-model');


// processTraderBuyBitcoinOrder: Middleware to process the purchase
// of bitcoin by a trader.
const processTraderBuyBitcoinOrder = async (req, res, next) => {

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

        // assign variables in request  to tell that all ops succeeded and the bitcoin balance.
        req.isOpSuccessful = true;
        req.balance = (remainingMoney / pageDetails.Bitcoin_price);
        next();
    }

}


// processTraderSellBitcoinOrder: Middleware to process the selling
// of bitcoin by a trader
const processTraderSellBitcoinOrder = async (req, res, next) => {

    // collect info from the req body
    const pageDetails = req.body;

    // decode the token
    const decoded = jwtDecode(req.headers.authorization);

    // retrieve client info of trader
    const client = await Client.retrieveClientInfo(pageDetails.email);

    // convert the bitcoin balance and price to an actual Number type from a string
    const convertedBitcoinBalance = Number(pageDetails.Bitcoin_balance);
    const convertedBitcoinPrice = Number(pageDetails.Bitcoin_price);

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
        const currentBitcoin = client.Bitcoin_balance;
        let updatedBitcoin = currentBitcoin -
            convertedBitcoinBalance;


        // Insert the updated bitcoin for client
        const updateBitcoin = await Client.updateBitcoinWallet(decoded.email,
            updatedBitcoin);

        // calculate the remaining bitcoin dollar amount
        // after trader takes commission
        const remainingUSD = (convertedBitcoinPrice * convertedBitcoinBalance) - (commissionPay * convertedBitcoinPrice);

        // update the usd balance for client
        const updateUSDBalance = await Client.updateUSDBalance(client.email, remainingUSD);

        const date = new Date();
        const formattedDate = `${date.getFullYear()}` + '-' + `${date.getMonth()}` + '-' + `${date.getDate()}`;


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
        const incrementedTrades = (client.num_trades + 1);
        const updateNumTrades = await Client.updateNumTrades(client.email, incrementedTrades);

        // Update trader bitcoin balance            
        const trader = await Trader.retreiveTraderInfo(decoded.email);
        const updatedTraderBitoinBalance = Number(trader.Bitcoin_balance) + Number(commissionPay);


        const updateTraderBitcoinBalance = await Trader.updateBitcoinBalanceOfTrader(trader.trader_id, updatedTraderBitoinBalance);


        // insert order into order table
        const addOrder = await Client.addOrder(orderCreds)



        if (addOrder &&
            client &&
            updateBitcoin &&
            updateNumTrades &&
            trader &&
            updateTraderBitcoinBalance &&
            updateUSDBalance) {
            // assign variables in request  to tell that all ops succeeded and the bitcoin balance.
            req.isOpSuccessful = true;
            req.balance = convertedBitcoinBalance;
            next();

        }

    }

}




module.exports = {
    processTraderBuyBitcoinOrder,
    processTraderSellBitcoinOrder
}