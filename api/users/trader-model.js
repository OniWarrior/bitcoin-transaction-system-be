const db = require('../data/dbConfig')





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




module.exports = {
    findClientByEmail,
    findClientByEmailAndFullName,
    findClientByFullName
}