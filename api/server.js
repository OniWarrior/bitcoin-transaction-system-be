const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

// Routers
const authRouter = require('../api/auth/auth-router');
const clientRouter = require('../api/users/client-router');
const traderRouter = require('../api/users/trader-router');
const managerRouter = require('../api/users/manager-router');
const cryptoRouter = require('../api/users/crypto-router');

// Middleware
const { restricted } = require('../api/auth/auth-middleware');

const server = express();

// Basic Middleware
server.use(express.json());
server.use(cookieParser());
server.use(helmet());

// CORS Configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'https://yourproductiondomain.com'], // List all domains that are allowed to access or use '*'
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // if your site uses cookies/session
};

server.use(cors(corsOptions));

// Routes
server.use('/api/auth', authRouter);  // Authentication routes

// User-related routes with restricted middleware applied where necessary
server.use('/api/users/crypto', cryptoRouter);  // Crypto-related routes
server.use('/api/users/clients', restricted, clientRouter);  // Client routes, requires auth
server.use('/api/users/traders', restricted, traderRouter);  // Trader routes, requires auth
server.use('/api/users/managers', restricted, managerRouter);  // Manager routes, requires auth

// Export the configured server
module.exports = server;