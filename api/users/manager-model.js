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

// Manager op--retrieve total number orders made on the current week
// note-- dates are inputted by manager
async function retrieveWeeklyTransactions(startDate, endDate) {
    const transactions = await db('Order')
        .count('order_id')
        .whereBetween('date', [startDate, endDate])
        .first()
    return transactions


}


// Manager op--retrieve total number of orders made during the month
// note--month and year are provided by manager
async function retrieveMonthlyTransactions(month, year) {
    const transactions = await db('Order')
        .count('order_id')
        .whereRaw('MONTH(date)=? and YEAR(date)=?', [month, year])
        .first()
    return transactions
}