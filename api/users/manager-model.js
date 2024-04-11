const db = require('../data/dbConfig')



// Manager op -- retrieve total number orders made on the day provided
// note-- dates are inputted by manager
async function retrieveDailyTransactions(todaysDate) {
    const transactions = await db('Order')
        .count('order_id')
        .where('date', todaysDate)
        .first()
    return transactions
}

// Manager op--retrieve all orders made on the current week
// note-- dates are inputted by manager
async function retrieveWeeklyTransactions(startDate, endDate) {
    const transactions = await db('Order')
        .count('order_id')
        .whereBetween('date', [startDate, endDate])
        .first()
    return transactions


}