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

const allowedOrigins = [
    'https://rev-bts.vercel.app', // production frontend
    'http://localhost:3000',     // dev frontends you use

];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow tools like Postman (no origin)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false, // set to true ONLY if you use cookies / auth that require it
};



server.use(express.json());
server.use(helmet());
server.use(cors(corsOptions));
server.options('*', cors(corsOptions));
server.use(cookieParser());


server.use('/api/auth', authRouter);

server.use('/api/users', clientRouter, traderRouter, managerRouter, restricted);

module.exports = server