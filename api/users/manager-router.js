const router = require('express').Router()
const Manager = require('./manager-model')



// /daily: path to retrieve total number of daily transactions
router.get('/daily', async (req, res, next) => {
    try {

        // retrieve date information from body then reformat to be retrieved from database
        const date = req.body
        const formattedDate = `${date.year}-${date.month}-${date.day}`;

        // retrieve the total daily transactions
        const totalDailyTransactions = await Manager.retrieveDailyTransactions(formattedDate)

        // check if the retrieval was successful
        if (totalDailyTransactions) {
            // retrieval successful, send success response.
            res.status(200)
                .json(totalDailyTransactions)
        }
        else {

            // retrieval failed, send failure response.
            res.status(404).json({ message: "No transactions found for this date." });
        }

    }
    catch (err) {
        // internal server error, send failure response.
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})


// /weekly: path to retrieve total number of transactions for the week
router.get('/weekly', async (req, res, next) => {
    try {

        // retrieve date information from body then reformat to be retrieved from database
        const date = req.body;
        const startDate = `${date.start_year}` + '-' + `${date.start_month}` + '-' + `${date.start_day}`;
        const endDate = `${date.end_year}` + '-' + `${date.end_month}` + '-' + `${date.end_day}`;

        // retrieve total weekly transactions
        const totalWeeklyTransactions = await Manager.retrieveWeeklyTransactions(startDate, endDate);

        // check if the retrieval was successful
        if (totalWeeklyTransactions) {
            // retrieval successful, send success response.
            res.status(200)
                .json(totalWeeklyTransactions)
        }

    }
    catch (err) {
        // internal server error, send failure response.
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})

// /weekly: path to retrieve total number of transactions for the month
router.get('/monthly', async (req, res, next) => {
    try {

        // retrieve date information then retrieve monthly transacs from database
        const date = req.body;

        // retrieve the total monthly transactions from db and save result
        const totalMonthlyTransactions = await Manager.retrieveMonthlyTransactions(date.month, date.year);

        // check if retrieval was successful
        if (totalMonthlyTransactions) {
            // retrieval successful, send success response.
            res.status(200)
                .json(totalMonthlyTransactions)
        }

    } catch (err) {
        // internal server error, send failure response.
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})

module.exports = router
