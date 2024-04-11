const db = require('../data/dbConfig')



// Manager op -- retrieve all orders made on the day provided
async function retrieveDailyTransactions(todaysDate) {
    const transactions = await db('Order')
        .select([
            'client_id',
            'date',
            'comm_paid',
            'comm_type',
            'Bitcoin_balance',
            'isCancelled'
        ])
        .where('date', todaysDate)
    return transactions
}