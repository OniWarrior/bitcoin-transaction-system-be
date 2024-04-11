const router = require('express').Router()
const Manager = require('./manager-model')
const { restricted } = require('../auth/auth-middleware')


// path to retrieve total number of daily transactions
router.get('/total-daily-transactions', restricted, async (req, res, next) => {
    try {
        const date = req.body
        const totalDailyTransactions = await Manager.retrieveDailyTransactions(date.date)

        if (totalDailyTransactions) {
            res.status(200)
                .json(totalDailyTransactions)
        }

    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})


// path to retrieve total number of transactions for the week
router.get('/total-weekly-transactions', restricted, async (req, res, next) => {
    try {
        const date = req.body
        const totalWeeklyTransactions = await Manager.retrieveWeeklyTransactions(date.startDate, date.endDate)

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
router.get('/total-monthly-transactions', restricted, async (req, res, next) => {
    try {
        const date = req.body
        const totalMonthlyTransactions = await Manager.retrieveMonthlyTransactions(date.month, date.year)

        if (totalMonthlyTransactions) {
            res.status(200)
                .json(`Server Error: ${err.message}`)
        }

    } catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})

module.exports = router
