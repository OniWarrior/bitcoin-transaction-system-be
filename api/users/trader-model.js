const db = require('../data/dbConfig')

// For trader--update the USD balance account of trader
function updateUSDBalanceOfTrader(traderId, USD) {
    return db('Trader')
        .returning([
            'USD_balance'
        ])
        .where('trader_id', traderId)
        .update('USD', USD)
}

// For trader--update the Bitcoin balance account of trader
function updateBitcoinBalanceOfTrader(traderId, Bitcoin) {
    return db('Trader')
        .returning([
            'Bitcoin_balance'
        ])
        .where('trader_id', traderId)
        .update('Bitcoin_balance', Bitcoin)
}

// For trader --update the transfer account of trader
function updateTransferAccountById(traderId, USD) {
    return db('Trader')
        .returning([
            'transfer_balance'
        ])
        .where('trader_id', traderId)
        .update('USD', USD)
}




// For trader--find the client based on entering their email
async function findClientByEmail(client) {
    const foundClient = await db('Client')
        .select([
            'client_id',
            'first_name',
            'last_name',
            'email'
        ])
        .where('email', client.email)
        .first()
    return foundClient
}


// For trader--find the client based on entering their
// email, first name, and last name.
async function findClientByEmailAndFullName(client) {
    const foundClient = await db('Client')
        .select([
            'client_id',
            'first_name',
            'last_name',
            'email'
        ])
        .where({
            first_name: client.first_name,
            last_name: client.last_name,
            email: client.email
        })
        .first()
    return foundClient
}

// For Trader--insert cancelled payment or transaction
//into cancel log
function addTransacOrPayment(cancelled) {
    return db('Cancel_log')
        .returning([
            'order_id',
            'client_id',
            'trader_id',
            'transac_id',
            'date',
            'comm_paid',
            'comm_type',
            'Bitcoin_value',
            'amount_paid'
        ])
        .insert(cancelled)
}




module.exports = {
    findClientByEmail,
    findClientByEmailAndFullName,
    addTransacOrPayment,
    updateTransferAccountById,
    updateUSDBalanceOfTrader,
    updateBitcoinBalanceOfTrader
}