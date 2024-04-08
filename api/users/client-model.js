const db = require('../data/dbConfig')




// For client-- find the clients bitcoin wallet
function findClientBitcoinWallet(email) {
    return db('Client')
        .select(['Bitcoin_balance'])
        .where('email', email)
        .first()
}

// For client-- find the client's usd balance
function findClientBalance(email) {
    return db('Client')
        .select(['USD_balance'])
        .where('email', email)
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

// For client and Trader issuing transaction--creates a record of the order placed
// by the client. Whether they bought or sold bitcoin.
function addOrder(order) {
    return db('Order')
        .returning([
            'client_id',
            'date',
            'comm_paid',
            'comm_type',
            'Bitcoin_value'
        ])
        .insert(order)
}




// For Client--retrieve past orders
// of buying and selling bitcoin
async function retrievePastOrders(clientId) {
    const orders = await ('Order')
        .select([
            'order_id',
            'date',
            'comm_paid',
            'comm_type',
            'Bitcoin_value'
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
    findClientBitcoinWallet,
    findClientBalance,
    updateBitcoinWallet,
    updateUSDBalance,
    addOrder,
    retrievePastOrders,
    transerMoney
}