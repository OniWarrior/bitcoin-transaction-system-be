
// Update with your config settings
require('dotenv').config()


const pg = require('pg')


if (process.env.DATABASE_URL) {
    pg.defaults.ssl = { rejectUnauthorized: false }
}

