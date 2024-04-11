const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
    checkIfEmailExists,
    checkIfEmailAlreadyRegistered,
    checkForMissingEmailOrPassword

} = require('./auth-middleware');


const Client = require('../users/client-model')
const User = require('../users/user-model');
const { JWT_SECRET } = require('../secrets/secret');

// path to register new account
router.post('/Signup', checkIfEmailAlreadyRegistered, checkForMissingEmailOrPassword, async (req, res, next) => {
    try {
        let user = req.body
        const rounds = parseInt(process.env.ROUNDS)
        const hash = bcrypt.hashSync(user.password, rounds)
        user.password = hash

        // Initial balance for the fiat account and bitcoin
        // account fro client.
        user.USD_balance = 0.00
        user.Bitcoin_balance = 0.00

        // Initial values for membership level
        // of client and the number of trades.
        user.mem_level = 'Silver'
        user.num_trades = 0

        const clientCredentials = {
            first_name: user.first_name,
            last_name: user.last_name,
            phone_num: user.phone_num,
            cell_phone: user.cell_num,
            email: user.email,
            street_addr: user.street_addr,
            city: user.city,
            state: user.state,
            zip_code: user.zip_code,
            USD_balance: user.USD_balance,
            Bitcoin_balance: user.Bitcoin_balance,
            mem_level: user.mem_level,
            num_trades: user.num_trades
        }

        const traderCredentials = {
            first_name: user.first_name,
            last_name: user.last_name,
            phone_num: user.phone_num,
            cell_phone: user.cell_num,
            email: user.email,
            street_addr: user.street_addr,
            city: user.city,
            state: user.state,
            zip_code: user.zip_code,
            Bitcoin_balance: user.Bitcoin_balance,
            USD_balance: user.USD_balance,
            transfer_balance: user.transfer_balance
        }

        const userCredentials = {
            email: user.email,
            password: user.password,
            user_type: user.user_type
        }



        const addUser = await User.addUser(userCredentials)



        if (addUser) {

            if (user.user_type === 'client') {
                const addClient = await User.addClient(clientCredentials)

                if (addClient) {
                    res.status(201).json(addUser, addClient)
                }
            }
            else if (user.user_type === 'trader') {
                const addTrader = await User.addTrader(traderCredentials)

                if (addTrader) {
                    res.status(201).json(addUser, addTrader)
                }
            }
        }


    }
    catch (err) {
        res.status(500).json(`Server error: ${err.message}`)

    }


})


// path to login an existing user
router.post('/Login', checkForMissingEmailOrPassword, checkIfEmailExists, async (req, res, next) => {


    try {
        const { email, password } = req.body

        // find user by email
        const foundUser = await User.findByEmail(email)

        // retrieve the information of the user if they are client user type
        let client

        // check user type
        if (foundUser.user_type === 'Client') {

            // Retrieve client info
            client = await Client.retrieveClientInfo(email)

            // check member level
            if (client.mem_level === 'Gold') {
                const encryption = bcrypt.compareSync(password, foundUser.password)

                if (foundUser && encryption) {
                    const token = makeToken(foundUser)

                    res.status(201)
                        .cookie('token', token)
                        .json({
                            message: `Welcome back ${foundUser.email}`, token,
                        })
                }
                else {
                    res.status(401).json('Invalid email/password credentials')
                }
            }
            else {  // clients member level is Silver

                // retrieve the total number of trades for the client for the month
                let month = new Date().getMonth()
                const totalTransactions = await User.getClientNumTrades(client.client_id, month)
                let updateMemberLevel

                // check if the client member level needs to be updated
                if (totalTransactions >= 20) {
                    let memberLevel = "Gold"
                    updateMemberLevel = await User.updateMemberLevel(client.client_id, memberLevel)
                }

                // find whether or not the password matches database password
                const encryption = bcrypt.compareSync(password, foundUser.password)



                if (foundUser && encryption) {
                    const token = makeToken(foundUser)

                    res.status(201)
                        .cookie('token', token)
                        .json({
                            message: `Welcome back ${foundUser.email}`, token,
                        })
                }
                else {
                    res.status(401).json('Invalid email/password credentials')
                }



            }
        }
        else {

            // find whether or not the password matches database password
            const encryption = bcrypt.compareSync(password, foundUser.password)

            if (foundUser && encryption) {
                const token = makeToken(foundUser)

                res.status(201)
                    .cookie('token', token)
                    .json({
                        message: `Welcome back ${foundUser.email}`, token,
                    })
            }
            else {
                res.status(401).json('Invalid email/password credentials')
            }
        }
    }
    catch (err) {
        res.status(500)
            .json(`Server error: ${err.message}`)

    }

})

//create token after successful login
const makeToken = (user) => {
    const payload = {
        user_id: user.user_id,
        email: user.email,
        password: user.password
    }

    const option = {
        expiresIn: '1d'
    }

    return jwt.sign(payload, JWT_SECRET, option)

}



module.exports = router

