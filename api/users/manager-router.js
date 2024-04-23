const router = require('express').Router()
const Manager = require('./manager-model')
const { restricted } = require('../auth/auth-middleware')


// path to retrieve total number of daily transactions
router.post('/daily', async (req, res, next) => {
    try {

        // retrieve date information from body then reformat to be retrieved from database
        const date = req.body
        const formattedDate = `${date.year}-${date.month}-${date.day}`;
        const totalDailyTransactions = await Manager.retrieveDailyTransactions(formattedDate)

        if (totalDailyTransactions) {
            res.status(200)
                .json(totalDailyTransactions)
        }
        else {
            res.status(404).json({ message: "No transactions found for this date." });
        }

    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})


// path to retrieve total number of transactions for the week
router.post('/weekly', async (req, res, next) => {
    try {

        // retrieve date information from body then reformat to be retrieved from database
        const date = req.body
        const startDate = `${date.startDate.year}` + '-' + `${date.startDate.month}` + '-' + `${date.startDate.day}`
        const endDate = `${date.endDate.year}` + '-' + `${date.endDate.month}` + '-' + `${date.endDate.day}`
        const totalWeeklyTransactions = await Manager.retrieveWeeklyTransactions(startDate, endDate)

        if (totalWeeklyTransactions) {
            res.status(200)
                .json(totalWeeklyTransactions)
        }

    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})

// path to retrieve total number of transactions for the month
router.post('/monthly', async (req, res, next) => {
    try {

        // retrieve date information then retrieve monthly transacs from database
        const date = req.body
        const totalMonthlyTransactions = await Manager.retrieveMonthlyTransactions(date.month, date.year)

        if (totalMonthlyTransactions) {
            res.status(200)
                .json(totalMonthlyTransactions)
        }

    } catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})

module.exports = router
