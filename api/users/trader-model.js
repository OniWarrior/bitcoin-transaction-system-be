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
async function findClientByEmail(email) {
    const foundClient = await db('Client')
        .select([
            'client_id',
            'first_name',
            'last_name',
            'email'
        ])
        .where('email', email)
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

// For Trader--retrieve transfer payments--either pending or payments in which
// money as been invested
async function retrieveTransferPayments(clientId) {
    const transactions = await db('Transfer')
        .select([
            'transac_id',
            'client_id',
            'trader_id',
            'amount_paid',
            'date'
        ])
        .where('client_id', clientId)

    return transactions

}

// For Trader-- update the Transfer records of
// non invested transfers to invested
function updateTransferRecords(clientId, notInvested, isInvested) {
    return db('Transfer')
        .returning([
            'isInvested'
        ])
        .where({ client_id: clientId, isInvested: notInvested })
        .update('isInvested', isInvested)

}

// For Trader--retrieve the total amount of transfer money that exists
// that comes from payment transfers that are not invested
async function retrieveTotalFromPendingTransferPayments(clientId, isInvested) {
    const transactions = await db('Transfer')
        .sum('amount_paid')
        .where({ client_id: clientId, isInvested: isInvested })

    return transactions

}

// For Trader--update order record
// to indicate that a tranfser payment is cancelled
function updateIsCancelledOrder(clientId, isCancelled) {
    return db('Order')
        .select(['isCancelled'])
        .where('client_id', clientId)
        .update(isCancelled)
}

// For Trader--update tranfser record
// to indicate that a tranfser payment is cancelled 
function updateIsCancelledTransfer(clientId, isCancelled) {
    return db('Transfer')
        .select(['isCancelled'])
        .where('client_id', clientId)
        .update(isCancelled)
}

// For Trader--retrieve trader info
async function retreiveTraderInfo(email) {
    const foundInfo = await db('Trader')
        .select([

            'Bitcoin_balance',
            'USD_balance',
            'transfer_balance',
        ])
        .where('email', email)
        .first()
    return foundInfo


}



module.exports = {
    findClientByEmail,
    findClientByEmailAndFullName,
    addTransacOrPayment,
    updateTransferAccountById,
    updateUSDBalanceOfTrader,
    updateBitcoinBalanceOfTrader,
    retrieveTransferPayments,
    updateIsCancelledOrder,
    updateIsCancelledTransfer,
    retreiveTraderInfo,
    retrieveTotalFromPendingTransferPayments,
    updateTransferRecords
}