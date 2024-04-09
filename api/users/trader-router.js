const router = require('express').Router()
const Client = require('./client-model')
const { default: jwtDecode } = require('jwt-decode')
const { restricted, checkIfPasswordExists } = require('../auth/auth-middleware')
const Trader = require('./trader-model')


// path to retrieve client in search
router.get('/FindClient', restricted, async (req, res, next) => {
    try {
        // get client search credentials
        const client = req.body
        let temp;


        // search for client based on email,fullname and email
        if (!client.first_name && !client.last_name && client.email) {
            temp = await Trader.findClientByEmail(email)

        }
        else if (client.first_name && client.last_name && client.email) {
            temp = Trader.findClientByEmailAndFullName(client)

        }
        else if (client.email) {
            temp = await Trader.findClientByEmail(email)

        }

        const retrievedClient = temp
        if (retrievedClient) {
            res.status(200)
                .json(retrievedClient)
        }





    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)

    }

})


// path to retrieve all transfer payments made by clients
// and retrieve all transactions made by the trader
router.get('client_id/RetrievePaymentsAndTransacs', restricted, async (req, res, next) => {

    try {
        const { client_id } = req.params


        const orders = await Client.retrievePastOrders(client_id)
        const transfers = await Trader.retrieveTransferPayments(client_id)

        if (orders && transfers) {
            res.status(200)
                .json(orders, transfers)

        }

    }
    catch (err) {
        res.status(500)
            .json(`Server Error: ${err.message}`)
    }







})
