const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

const { restricted } = require('../api/auth/auth-middleware')

const authRouter = require('../api/auth/auth-router')
const userRouter = require('../api/auth/user-router')

const server = express()

server.use(express.json())
server.use(helmet())
server.use(cors())
server.use(cookieParser())

server.use('/api/auth', authRouter)
server.use('/api/users', userRouter, restricted)

module.exports = server