const db = require('../data/dbConfig')



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
            'Bitcoin_balance'
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
            'zip_code'

        ])
        .insert(trader)


}


// For trader--find the client based on entering the first name and last name 
// of client
async function findClientByFullName(client) {
    const foundClient = await db('Client')
        .select([
            'client_id',
            'first_name',
            'last_name',
            'email'])
        .where({
            first_name: client.first_name,
            last_name: client.last_name
        })
        .first()
    return foundClient


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


// For client-- find the clients bitcoin wallet
function findClientBitcoinWallet(email) {
    return db('Client')
        .select(['Bitcoin_balance'])
        .where('email', email)
        .first()
}

// For client--Add bitcoin to bitcoin balance after
// purchasing bitcoin
function addBitcoinToWallet(email, bitcoin) {
    return db('Client')
        .returning([
            'Bitcoin_balance'
        ])
        .where('email', email)
        .insert(bitcoin)
}


module.exports = {
    findByEmail,
    addUser,
    addTrader,
    addClient,
    findClientByFullName,
    findClientByEmail,
    findClientByEmailAndFullName,
    findClientBitcoinWallet,
    addBitcoinToWallet
}