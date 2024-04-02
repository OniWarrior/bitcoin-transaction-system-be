const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

const { restricted } = require('../api/auth/auth-middleware')

const authRouter = require('../api/auth/auth-router')
const userRouter = require('../api/auth/user-router')

const server = express()