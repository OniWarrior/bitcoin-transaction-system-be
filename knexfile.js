
// Update with your config settings
require('dotenv').config()


const pg = require('pg')


if (process.env.DATABASE_URL) {
    pg.defaults.ssl = { rejectUnauthorized: false }
}

const sharedConfig = {
    client: pg,
    migrations: { directory: '.api/data/migrations' },
    seeds: { directory: '.api/data/seeds' }
}

