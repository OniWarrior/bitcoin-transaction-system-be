const db = require('../data/dbConfig')



// get the total number of trades for the month
// for the client
async function getClientNumTrades(clientId, month) {

    // First - retrieve all dates of orders for the client using the client id
    const numDates = await db('Order')
        .select('date')
        .where('client_id', clientId)

    // convert data to an array of strings
    const numDatesArr = numDates.map(row => row.date)

    // next iterate through the dates
    let numTrades = 0  // var to carry the number of trades for the month
    numDatesArr.forEach(date => {

        // slice out the month from the date object
        let slicedDate = date.getMonth() + 1
        slicedDate = slicedDate.toString()

        // check if the sliced date month is single digit
        if (slicedDate.length < 2) {
            slicedDate = "0" + slicedDate
        }

        // convert month to string
        let convMonth = month.toString()
        // check if month is single digit
        if (convMonth.length < 2) {
            convMonth = "0" + convMonth
        }

        // check if the sliced date and month are a match
        if (slicedDate === convMonth) {
            numTrades += 1
        }
    });
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
function findByEmail(email) {
    return db('User')
        .select('email', 'password', 'user_type')
        .where({ email: email })
        .first()



}


// Add a user to database
function addUser(user) {
    return db('User')
        .returning(['email', 'password', 'user_type'])
        .insert(user)

}


// add a client to database
function addClient(client) {
    return db('Client')
        .returning([
            'client_id',
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
            'trader_id',
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