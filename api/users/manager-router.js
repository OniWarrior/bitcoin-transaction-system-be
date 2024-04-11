const router = require('express').Router()
const Manager = require('./manager-model')
const { default: jwtDecode } = require('jwt-decode')
const { restricted } = require('../auth/auth-middleware')


// path to retrieve total number of transactions for the week
router.get('/total-daily-transactions', restricted, async (req, res, next) => {
    try {

    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }
})
