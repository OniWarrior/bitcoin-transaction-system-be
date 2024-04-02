require('dotenv').config()

const PORT = process.env.PORT || 5000 // this is fallback for testing

const server = require('./api/server.js')
