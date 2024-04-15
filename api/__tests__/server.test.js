const request = require('supertest')
const server = require('../server')
const db = require('../data/dbConfig')

// start with a fresh unaltered db before doing main tests
beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})


afterAll(async () => {
    await db.destroy()
})