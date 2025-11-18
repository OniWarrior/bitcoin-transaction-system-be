const db = require('../data/dbConfig')



// Manager op -- retrieve total number orders made on the day provided
// note-- dates are inputted by manager
async function retrieveDailyTransactions(todaysDate) {
    const transactions = await db('Order')
        .count('order_id')
        .where('date', todaysDate)
    return transactions
}

// Manager op--retrieve total number orders made on the current week
// note-- dates are inputted by manager
async function retrieveWeeklyTransactions(startDate, endDate) {
    const transactions = await db('Order')
        .count('order_id')
        .whereBetween('date', [startDate, endDate])
    return transactions


}


// Manager op--retrieve total number of orders made during the month
// note--month and year are provided by manager
async function retrieveMonthlyTransactions(month, year) {
    const transactions = await db('Order')
        .count('order_id')
        .whereRaw('EXTRACT(MONTH FROM date) = ? AND EXTRACT(YEAR FROM date) = ?', [month, year])

    return transactions
}

module.exports = {
    retrieveDailyTransactions,
    retrieveWeeklyTransactions,
    retrieveMonthlyTransactions
}