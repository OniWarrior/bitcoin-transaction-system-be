const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
    checkIfEmailExists,
    checkIfEmailAlreadyRegistered,
    checkForMissingEmailOrPassword

} = require('./auth-middleware');

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
    const { email, password } = req.body

    User.findByEmail(email)
        .then(([user]) => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = makeToken(user)

                res.status(200)
                    .cookie('token', token)
                    .json({
                        message: `Welcome back ${user.email}`,
                        token
                    })


            }
            else {
                res.status(401).json('Invalid email/password credentials')
            }




        })
        .catch(err => {
            res.status(500).json(`Server error: ${err.message}`)
        })

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

