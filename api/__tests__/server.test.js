const request = require('supertest')
const server = require('../server')
const db = require('../data/dbConfig')

// start with a fresh unaltered db before doing main tests
beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})

// destroy db after tests have been conducted
afterAll(async () => {
    await db.destroy()
})


// integration tests for signup post request for client
describe('[POST] /Signup', () => {
    it('returns a status of 201 Created', () => {
        request(server)
            .post('/api/auth/Signup')
            .send({
                first_name: 'fdsfds',
                last_name: 'Bfdsafdsa',
                phone_num: '(214)-111-2222',
                cell_num: '(514)-333-4444',
                email: 'larry@gmail.com',
                city: 'Dallas',
                state: 'Texas',
                street_addr: ' 2015 hello ln',
                zip_code: '75050',
                password: '456123',
                user_type: 'Client'


            })
            .then(successCode => {
                expect(successCode.status).toBe(201)
            })


    })
    it('returns a status of 401 to indicate failure of request', () => {
        request(server)
            .post('/api/auth/Signup')
            .send({
                first_name: '',
                last_name: '',
                phone_num: '',
                cell_num: '',
                email: '',
                city: '',
                state: '',
                street_addr: ' ',
                zip_code: '',
                password: '',
                user_type: ''
            })
            .then(failureCode => {
                expect(failureCode.status).toBe(401)
            })
    })

})




// tests for signup post request for trader
describe('[POST] /Signup', () => {
    it('returns a status of 201 Created', () => {
        request(server)
            .post('/api/auth/Signup')
            .send({
                first_name: 'fdsafdsa',
                last_name: 'fdsafdsa',
                phone_num: '(214)-111-2222',
                cell_num: '(514)-333-4444',
                email: 'jonronjon@gmail.com',
                city: 'Dallas',
                state: 'Texas',
                street_addr: ' 2015 hello ln',
                zip_code: '75050',
                password: '45612323434243',
                user_type: 'Trader'

            })
            .then(successCode => {
                expect(successCode.status).toBe(201)
            })


    })
    it('returns a status of 401 to indicate failure of request', () => {
        request(server)
            .post('/api/auth/Signup')
            .send({
                first_name: '',
                last_name: '',
                phone_num: '',
                cell_num: '',
                email: '',
                city: '',
                state: '',
                street_addr: ' ',
                zip_code: '',
                password: '',
                user_type: ''
            })
            .then(failureCode => {
                expect(failureCode.status).toBe(401)
            })

    })

})



// integrations tests for login request
describe('[POST] /Login', () => {
    it('returns a status 200 login successful', () => {

        request(server)
            .post('/api/auth/Login')
            .send({
                email: 'johnson_bryon@gmail.com',
                password: "456123"
            })
            .then(successCode => {
                expect(successCode.status).toBe(200)

            })
    })

    it('returns 401 when invalid credentials are entered', () => {


        request(server)
            .post('/api/auth/Login')
            .send({
                email: '',
                password: ''
            })
            .then(failureCode => {
                expect(failureCode.status).toBe(401)
            })
    })
})


// Integration tests for retrieval of past orders of client
describe('[GET] /Orders', () => {
    it('returns 200 upon successful retrieval', () => {

        request(server)
            .post('/api/auth/Login')
            .send({
                email: 'johnson_bryon@gmail.com',
                password: "456123"
            })
            .then((success) => {
                let token = success.text.slice(51, 332)
                request(server)
                    .get('/api/users/Orders')
                    .set("Authorization", token)
                    .then(successCode => {
                        expect(successCode.status).toBe(200)
                    })
            })
    })
})


// Integration tests for retrieval bitcoin walled of client
describe('[GET] /BitcoinWallet', () => {
    it('returns 200 upon successful retrieval', () => {

        request(server)
            .post('/api/auth/Login')
            .send({
                email: 'johnson_bryon@gmail.com',
                password: "456123"
            })
            .then((success) => {
                let token = success.text.slice(51, 332)
                request(server)
                    .get('/api/users/BitcoinWallet')
                    .set("Authorization", token)
                    .then(successCode => {
                        expect(successCode.status).toBe(200)
                    })
            })
    })
})


// Integration tests for transfer of money from client to trader
describe('[POST] /TransferMoney', () => {
    it('returns 200 upon successful Transfer of money', () => {

        request(server)
            .post('/api/auth/Login')
            .send({
                email: 'johnson_bryon@gmail.com',
                password: "456123"
            })
            .then((success) => {
                let token = success.text.slice(51, 332)
                request(server)
                    .post('/api/users/TransferMoney')
                    .set("Authorization", token)
                    .send({
                        client_id: '1',
                        trader_id: '1',
                        amount_paid: '20000.00',
                        isCancelled: 'false',
                        isInvested: 'false'
                    })
                    .then(successCode => {
                        expect(successCode.status).toBe(200)
                    })

            })
    })
})


// integrations tests for buying bitcoin by the client
describe('[POST] /BuyBitcoin', () => {
    it('returns a status 201 buying bitcoin successful', () => {



        request(server)
            .post('/api/users/BuyBitcoin')
            .send({
                email: 'johnson_bryon@gmail.com',
                Bitcoin_balance: '2.00',
                Bitcoin_price: '65229.90',
                comm_type: 'Bitcoin'

            })
            .then(successCode => {
                expect(successCode.status).toBe(201)
            })
    })

    it('returns 500 when invalid values are entered', () => {


        request(server)
            .post('/api/users/BuyBitcoin')
            .send({
                email: '',
                Bitcoin_balance: '',
                Bitcoin_price: '',
                comm_type: ''

            })
            .then(failureCode => {
                expect(failureCode.status).toBe(500)
            })

    })
})


// integrations tests for selling bitcoin by the client
describe('[POST] /SellBitcoin', () => {
    it('returns a status 201 selling bitcoin successful', () => {



        request(server)
            .post('/api/users/SellBitcoin')
            .send({
                email: 'johnson_bryon@gmail.com',
                Bitcoin_balance: '2.00',
                Bitcoin_price: '65229.90',
                comm_type: 'Bitcoin'

            })
            .then(successCode => {
                expect(successCode.status).toBe(201)
            })

    })

    it('returns 500 when invalid values are entered', () => {


        request(server)
            .post('/api/users/SellBitcoin')
            .send({
                email: '',
                Bitcoin_balance: '',
                Bitcoin_price: '',
                comm_type: ''

            })
            .then(failureCode => {
                expect(failureCode.status).toBe(500)
            })

    })
})



// integrations tests for buying bitcoin by the trader
describe('[POST] /TraderBuyBitcoin', () => {
    it('returns a status 201 selling bitcoin successful', () => {



        request(server)
            .post('/api/users/TraderBuyBitcoin')
            .send({
                email: 'gork@yahoo.com',
                Bitcoin_balance: '2.00',
                Bitcoin_price: '65229.90',
                comm_type: 'Bitcoin'

            })
            .then(successCode => {
                expect(successCode.status).toBe(201)
            })

    })

    it('returns 500 when invalid values are entered', () => {


        request(server)
            .post('/api/users/TraderBuyBitcoin')
            .send({
                email: '',
                Bitcoin_balance: '',
                Bitcoin_price: '',
                comm_type: ''

            })
            .then(failureCode => {
                expect(failureCode.status).toBe(500)
            })

    })
})


// integrations tests for selling bitcoin by the trader
describe('[POST] /TraderSellBitcoin', () => {
    it('returns a status 201 selling bitcoin successful', () => {



        request(server)
            .post('/api/users/TraderBuyBitcoin')
            .send({
                email: 'gork@yahoo.com',
                Bitcoin_balance: '2.00',
                Bitcoin_price: '65229.90',
                comm_type: 'Bitcoin'

            })
            .then(successCode => {
                expect(successCode.status).toBe(201)
            })

    })

    it('returns 500 when invalid values are entered', () => {


        request(server)
            .post('/api/users/SellBitcoin')
            .send({
                email: '',
                Bitcoin_balance: '',
                Bitcoin_price: '',
                comm_type: ''

            })
            .then(failureCode => {
                expect(failureCode.status).toBe(500)
            })

    })
})



// Integration tests for retrieval of client
describe('[GET] /clients/search', () => {
    it('returns 200 upon successful retrieval', () => {
        request(server)
            .post('/api/users/clients/search')
            .send({
                first_name: 'John',
                last_name: 'Bryon',
                email: 'johnson_bryon@gmail.com'
            })
            .then(successCode => {
                expect(successCode.status).toBe(200)
            })


    })
    it('returns 401 when invalid values are entered', () => {
        request(server)
            .post('/api/users/clients/search')
            .send({
                first_name: '',
                last_name: '',
                email: ''
            })
            .then(failureCode => {
                expect(failureCode.status).toBe(401)
            })

    })
})


// Integration tests for retrieval of payments and transactions made
// by Trader on behalf of the client
describe('[GET] /clients/:client_id/payments-and-transactions', () => {
    it('returns 200 upon successful retrieval', () => {
        request(server)
            .post('/api/users/clients/:client_id/payments-and-transactions')
            .send({
                client_id: 1
            })
            .then(successCode => {
                expect(successCode.status).toBe(200)
            })


    })
    it('returns 401 when invalid client id is sent', () => {
        request(server)
            .post('/api/users/clients/:client_id/payments-and-transactions')
            .send({
                client_id: ''
            })
            .then(failureCode => {
                expect(failureCode.status).toBe(401)
            })


    })



})


// Integration tests for cancelling a transfer payment or transaction
describe('[POST] /CancelPaymentOrTransaction', () => {
    it('returns 201 upon successful cancelling of payment or transaction', () => {
        request(server)
            .post('/api/users/CancelPaymentOrTransaction')
            .send({
                client_id: '1'
            })
            .then(successCode => {
                expect(successCode.status).toBe(201)
            })

    })
    it('returns 401  when invalid client id is sent', async () => {
        request(server)
            .post('/api/users/CancelPaymentsOrTransaction')
            .send({
                client_id: ''
            })
            .then(failureCode => {
                expect(failureCode.status).toBe(401)
            })

    })



})


// Integration tests for manager retrieving total daily transactions
describe('[GET] /total-daily-transactions', () => {
    it('returns 200 upon successful retrieval ot total daily transactions', () => {
        request(server)
            .post('/api/users/total-daily-transactions')
            .send({
                year: 2024,
                month: 4,
                day: 15
            })
            .then(successCode => {
                expect(successCode.status).toBe(200)
            })


    })
    it('returns 401 when invalid date is entered', () => {
        request(server)
            .post('/api/users/total-daily-transactions')
            .send({
                year: '',
                month: '',
                day: ''
            })
            .then(failureCode => {
                expect(failureCode.status).toBe(401)
            })

    })



})



// Integration tests for manager retrieving total weekly transactions
describe('[GET] /total-weekly-transactions', () => {
    it('returns 200 upon successful retrieval of total weekly transactions', () => {
        request(server)
            .post('/api/users/total-weekly-transactions')
            .send({
                startDate: { month: 4, day: 14, year: 2024 }, // this represents the 14th of April
                endDate: { month: 4, day: 20, year: 2024 }    // this represents the 20th of April
            })
            .then(successCode => {
                expect(successCode.status).toBe(200)
            })


    })
    it('returns 401 when invalid start date and end date are entered', () => {
        request(server)
            .post('/api/users/total-weekly-transactions')
            .send({
                startDate: '',
                endDate: ''
            })
            .then(failureCode => {
                expect(failureCode.status).toBe(401)
            })

    })



})


// Integration tests for manager retrieving total monthly transactions
describe('[GET] /total-monthly-transactions', () => {
    it('returns 200 upon successful retrieval of total monthly transactions', () => {
        request(server)
            .post('/api/users/total-monthly-transactions')
            .send({
                month: '4',
                year: '2024'

            })
            .then(successCode => {
                expect(successCode.status).toBe(200)
            })


    })
    it('returns 401 when invalid month and year are entered', () => {
        request(server)
            .post('/api/users/total-monthly-transactions')
            .send({
                month: '',
                year: ''
            })
            .then(failureCode => {
                expect(failureCode.status).toBe(401)
            })

    })



})





