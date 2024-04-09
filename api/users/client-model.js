const db = require('../data/dbConfig')



// For client--retrieve client info
async function retrieveClientInfo(email) {
    const clientInfo = await db('Client')
        .select([
            'client_id',
            'Bitcoin_balance',
            'USD_balance',
            'num_trades',
            'mem_level'
        ])
        .where('email', email)
        .first()
    return clientInfo
}



// For client--find the trader id
// associated with the client
function findTraderID(clientId) {
    return db('Trader')
        .select(['trader_id'])
        .where('client_id', clientId)
        .first()
}



// For client and Trader--update the amount of bitcoin
// after buying and/or selling bitcoin. Also update
// in the event the client pays the commission amount via bitcoin
function updateBitcoinWallet(email, bitcoin) {
    return db('Client')
        .returning([
            'Bitcoin_balance'
        ])
        .where('email', email)
        .update('Bitcoin_balance', bitcoin)
}

// For client and Trader--update the USD balance after
// buying and/or selling of bitcoin. Also
// update in the event the client pays the commission amount via USD
function updateUSDBalance(email, USD) {
    return db('Client')
        .returning([
            'USD_balance'
        ])
        .where('email', email)
        .update('USD', USD)
}

// For client--Update the number of trades for client
function updateNumTrades(email, trades) {
    return db('Client')
        .returning(['num_trades'])
        .where('email', email)
        .update(trades)
}

// For client and Trader issuing transaction--creates a record of the order placed
// by the client. Whether they bought or sold bitcoin.
function addOrder(order) {
    return db('Order')
        .returning([
            'client_id',
            'date',
            'comm_paid',
            'comm_type',
            'Bitcoin_balance'
        ])
        .insert(order)
}




// For Client--retrieve past orders
// of buying and selling bitcoin
async function retrievePastOrders(clientId) {
    const orders = await db('Order')
        .select([
            'order_id',
            'date',
            'comm_paid',
            'comm_type',
            'Bitcoin_balance'
        ])
        .where('client_id', clientId)

    return orders
}

// For Client--Transfer money to a 
// trader i.e create a record that money was transferred
function transerMoney(transfer) {
    return db('Transfer')
        .returning([
            'transac_id',
            'client_id',
            'trader_id',
            'amount_paid',
            'date'
        ])
        .insert(transfer)

}


module.exports = {
    retrieveClientInfo,
    retrievePastOrders,
    findTraderID,
    updateBitcoinWallet,
    updateUSDBalance,
    addOrder,
    transerMoney,
    updateNumTrades
}