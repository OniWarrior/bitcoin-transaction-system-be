const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

const { restricted } = require('../api/auth/auth-middleware')

const authRouter = require('../api/auth/auth-router')
const clientRouter = require('../api/users/client-router')
const traderRouter = require('../api/users/trader-router')
const managerRouter = require('../api/users/manager-router')
const cryptoRouter = require('../api/users/crypto-router')

const server = express()



server.use(express.json())
server.use(helmet())
server.use(cors())
server.use(cookieParser())


server.use('/api/auth', authRouter)

server.use('/api/users', cryptoRouter, clientRouter, traderRouter, managerRouter, restricted)

module.exports = server