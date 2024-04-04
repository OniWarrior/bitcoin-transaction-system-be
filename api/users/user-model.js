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

}

function addTrader(trader) {

}


module.exports = {
    findByEmail,
    addUser
}