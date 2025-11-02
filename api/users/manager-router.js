const router = require('express').Router()
const Manager = require('./manager-model')



// /daily: path to retrieve total number of daily transactions
router.post('/daily', async (req, res) => {
    try {

        // retrieve date information from body then reformat to be retrieved from database
        const { daily_date } = req.body;

        const daily = new Date(daily_date);
        const formattedDaily = `${daily.getFullYear()}-` + `${daily.getMonth()}-` + `${daily.getDate() - 1}`;

        // retrieve the total daily transactions
        const totalDailyTransactions = await Manager.retrieveDailyTransactions(formattedDaily)

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
router.post('/weekly', async (req, res, next) => {
    try {

        // retrieve date information from body then reformat to be retrieved from database
        const { start_date, end_date } = req.body;

        const convertedStart = new Date(start_date);
        const convertedEnd = new Date(end_date)
        const formattedStart = `${convertedStart.getFullYear()}-` + `${convertedStart.getMonth()}-` + `${convertedStart.getDate()}`;
        const formattedEnd = `${convertedEnd.getFullYear()}-` + `${convertedEnd.getMonth()}-` + `${convertedEnd.getDate()}`;
        console.log(formattedStart)
        console.log(formattedEnd)
        // retrieve total weekly transactions
        const totalWeeklyTransactions = await Manager.retrieveWeeklyTransactions(formattedStart, formattedEnd);

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
router.post('/monthly', async (req, res, next) => {
    try {

        // retrieve date information then retrieve monthly transacs from database
        const date = req.body;

        const convertedDate = new Date(date.date)
        const month = convertedDate.getMonth()

        // retrieve the total monthly transactions from db and save result
        const totalMonthlyTransactions = await Manager.retrieveMonthlyTransactions(month, convertedDate.getFullYear());

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
