const db = require('../data/dbConfig')


async function findByEmail(email) {
    const account = await db('User')
        .select(['email', 'password'])
        .where('email', email)
        .first()
    return account;

}

function addUser(user) {
    return db('User')
        .returning([
            'email',
            'password',
            'user_type'])
        .insert(user)

}

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

async function findClientByFullName(client) {
    const foundClient = await db('Client')
        .select([
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


module.exports = {
    findByEmail,
    addUser,
    addTrader,
    addClient,
    findClientByFullName
}