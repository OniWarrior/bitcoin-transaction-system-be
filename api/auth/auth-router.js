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
// /Signup: endpoint that processes the user information for the creation of a new account
router.post('/signup', checkIfEmailAlreadyRegistered, checkForMissingEmailOrPassword, async (req, res) => {
    try {

        // capture user information and hash the password
        let user = req.body
        const rounds = parseInt(process.env.ROUNDS)
        const hash = bcrypt.hashSync(user.password, rounds)
        user.password = hash


        // create object of pulled user info
        const userCredentials = {
            email: user.email,
            password: user.password,
            user_type: user.user_type
        }


        // attempt to add the user and save result
        const addUser = await User.addUser(userCredentials)


        // if adding a user was successful/ check if the user is a client or trader
        if (addUser) {

            // if client, then create a client object and add a client record
            if (user.user_type === 'Client') {

                // create client object filled with client credentials
                const clientCredentials = {

                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone_num: user.phone_num,
                    cell_num: user.cell_num,
                    email: user.email,
                    street_addr: user.street_addr,
                    city: user.city,
                    state: user.state,
                    zip_code: user.zip_code
                }

                // attempt to add the client object and save the results
                const addClient = await User.addClient(clientCredentials)

                // client addition to database was successful, send success response with code.
                if (addClient) {
                    return res.status(201).json({ user: addUser, client: addClient })
                }
            }
            // if the user type is a trader, process trader obj and insert into database
            else if (user.user_type === 'Trader') {

                // create a trader obj
                const traderCredentials = {

                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone_num: user.phone_num,
                    cell_num: user.cell_num,
                    email: user.email,
                    street_addr: user.street_addr,
                    city: user.city,
                    state: user.state,
                    zip_code: user.zip_code,

                }

                // attempt to add the trader obj to the database and save result
                const addTrader = await User.addTrader(traderCredentials)

                // trader insertion successful, return success response.
                if (addTrader) {
                    return res.status(201).json({ user: addUser, trader: addTrader })
                }
            }
        }


    }
    catch (err) {
        // internal server error, send failure response.
        return res.status(500).json(`Server error: ${err.message}`)

    }


})


// path to login an existing user
router.post('/login', checkForMissingEmailOrPassword, checkIfEmailExists, async (req, res) => {


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

                    return res.status(201)
                        .cookie('token', token)
                        .json({
                            message: `Welcome back ${foundUser.email}`, token,
                            ur: `${foundUser.user_type}`
                        })
                }
                else {
                    return res.status(401).json('Invalid email/password credentials')
                }
            }
            else {  // clients member level is Silver

                // retrieve the total number of trades for the client for the month
                let month = new Date().getMonth()
                const totalTransactions = await User.getClientNumTrades(client.client_id, month)


                // check if the client member level needs to be updated
                if (totalTransactions >= 20) {
                    let memberLevel = "Gold"
                    await User.updateMemberLevel(client.client_id, memberLevel);
                }

                // find whether or not the password matches database password
                const encryption = bcrypt.compareSync(password, foundUser.password)


                // if foundUser and encryption succeeded then make a token and send success response
                if (foundUser && encryption) {
                    // successful, make token
                    const token = makeToken(foundUser)

                    // send success response with email and token
                    return res.status(201)
                        .cookie('token', token)
                        .json({
                            message: `Welcome back ${foundUser.email}`, token,
                            ur: `${foundUser.user_type}`
                        })
                }
                else {
                    // if failed, then send failed response
                    return res.status(401).json('Invalid email/password credentials')
                }



            }
        }
        else { // usertype is a trader

            // find whether or not the password matches database password
            const encryption = bcrypt.compareSync(password, foundUser.password)

            // check if foundUser and encryption succeeded
            if (foundUser && encryption) {

                // success, make a token
                const token = makeToken(foundUser)

                // send success response with email and token
                return res.status(201)
                    .cookie('token', token)
                    .json({
                        message: `Welcome back ${foundUser.email}`, token,
                        ur: `${foundUser.user_type}`
                    })
            }
            else {
                // if failed, send failed response.
                return res.status(401).json('Invalid email/password credentials')
            }
        }
    }
    catch (err) {
        // internal server error, send failure response with server error code.
        return res.status(500)
            .json(`Server error: ${err.message}`)

    }

})

//create token after successful login
const makeToken = (user) => {

    // payload obj that carries the relevant user credentials
    const payload = {
        user_id: user.user_id,
        email: user.email,
        password: user.password

    }

    // expiration object for the expiration of the token
    const option = {
        expiresIn: '1d'
    }

    return jwt.sign(payload, JWT_SECRET, option)

}



module.exports = router

