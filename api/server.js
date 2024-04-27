const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

const { restricted } = require('../api/auth/auth-middleware')

const authRouter = require('../api/auth/auth-router')
const clientRouter = require('../api/users/client-router')
const traderRouter = require('../api/users/trader-router')
const managerRouter = require('../api/users/manager-router')
const cryptoRouter = require('../api/crypto/crypto-router')

const server = express()


const corsOptions = {
    origin: 'http://localhost:3000/', // Allow only your frontend domain
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
server.use(express.json())
server.use(helmet())
server.use(cors(corsOptions))
server.use(cookieParser())


server.use('/api/auth', authRouter)
server.use('/api/crypto', cryptoRouter)
server.use('/api/users', clientRouter, traderRouter, managerRouter, restricted)

module.exports = server