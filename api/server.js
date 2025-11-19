const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

const { restricted } = require('../api/auth/auth-middleware')

const authRouter = require('../api/auth/auth-router')
const clientRouter = require('../api/users/client-router')
const traderRouter = require('../api/users/trader-router')
const managerRouter = require('../api/users/manager-router')


const server = express()

// CORS Configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'rev-bts.vercel.app'], // List all domains that are allowed to access or use '*'
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // if your site uses cookies/session
};



server.use(express.json())
server.use(helmet())
server.use(cors(corsOptions))
server.use(cookieParser())


server.use('/api/auth', authRouter)

server.use('/api/users', clientRouter, traderRouter, managerRouter, restricted)

module.exports = server