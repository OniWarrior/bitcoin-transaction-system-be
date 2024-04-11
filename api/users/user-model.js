const db = require('../data/dbConfig')



// get the total number of trades for the month
// for the client
async function getClientNumTrades(clientId, month) {
    const numTrades = await db('Client')
        .select(['num_trades'])
        .whereRaw('client_id=? and Month(date)=?', [clientId, month])
        .first()
    return numTrades
}
// update the member level of the client
async function updateMemberLevel(clientId, memberLevelUp) {
    const updatedClient = await db('Client')
        .returning(['mem_level'])
        .where('client_id', clientId)
        .update(memberLevelUp)
    return updatedClient
}

// Find a user by email--not client or trader
async function findByEmail(email) {
    const account = await db('User')
        .select(['email', 'password'])
        .where('email', email)
        .first()
    return account;

}


// Add a user to database
function addUser(user) {
    return db('User')
        .returning([
            'email',
            'password',
            'user_type'])
        .insert(user)

}


// add a client to database
function addClient(client) {
    return db('Client')
        .returning([
            'first_name',
            'last_name',
            'phone_num',
            'cell_num',
            'email',
            'street_addr',
            'city',
            'state',
            'zip_code',
            'USD_balance',
            'Bitcoin_balance',
            'mem_level',
            'num_trades',
        ])
        .insert(client)

}


// add a trader to database
function addTrader(trader) {
    return db('Trader')
        .returning([
            'first_name',
            'last_name',
            'phone_num',
            'cell_num',
            'email',
            'street_addr',
            'city',
            'state',
            'zip_code',
            'Bitcoin_balance',
            'USD_balance',
            'transfer_balance',

        ])
        .insert(trader)


}


module.exports = { findByEmail, addUser, addClient, addTrader, updateMemberLevel, getClientNumTrades }