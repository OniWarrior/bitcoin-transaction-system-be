const date = new Date()
const formattedDate = `${date.getFullYear()}` + '-' + `${date.getMonth()}` + '-' + `${date.getDate()}`

const transfers = [
    {

        client_id: 1,
        trader_id: 1,
        amount_paid: 20000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: false

    },
    {

        client_id: 2,
        trader_id: 1,
        amount_paid: 30000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: true

    },
    {

        client_id: 3,
        trader_id: 1,
        amount_paid: 60000.00,
        date: formattedDate,
        isCancelled: true,
        isInvested: false

    },
    {

        client_id: 4,
        trader_id: 1,
        amount_paid: 30000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: true

    },
    {

        client_id: 5,
        trader_id: 1,
        amount_paid: 20000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: false

    },
    {

        client_id: 6,
        trader_id: 2,
        amount_paid: 15000.00,
        date: formattedDate,
        isCancelled: true,
        isInvested: false

    },
    {

        client_id: 7,
        trader_id: 2,
        amount_paid: 10000.00,
        date: formattedDate,
        isCancelled: true,
        isInvested: false

    },
    {

        client_id: 8,
        trader_id: 2,
        amount_paid: 30000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: false

    },
    {

        client_id: 9,
        trader_id: 2,
        amount_paid: 40000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: true

    },
    {

        client_id: 10,
        trader_id: 2,
        amount_paid: 10000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: false

    },
    {

        client_id: 11,
        trader_id: 3,
        amount_paid: 5000.00,
        date: formattedDate,
        isCancelled: true,
        isInvested: false

    },
    {

        client_id: 12,
        trader_id: 3,
        amount_paid: 25000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: true

    },
    {

        client_id: 13,
        trader_id: 3,
        amount_paid: 10000.00,
        date: formattedDate,
        isCancelled: true,
        isInvested: false

    },
    {

        client_id: 14,
        trader_id: 3,
        amount_paid: 50000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: true

    },
    {

        client_id: 15,
        trader_id: 3,
        amount_paid: 45000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: false

    },
    {

        client_id: 16,
        trader_id: 4,
        amount_paid: 5000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: true

    },
    {

        client_id: 17,
        trader_id: 4,
        amount_paid: 10000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: false

    },
    {

        client_id: 18,
        trader_id: 4,
        amount_paid: 30000.00,
        date: formattedDate,
        isCancelled: true,
        isInvested: false

    },
    {

        client_id: 19,
        trader_id: 4,
        amount_paid: 15000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: true

    },
    {

        client_id: 20,
        trader_id: 4,
        amount_paid: 5000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: false

    }

]


exports.seed = function (knex) {
    return knex('Transfer').insert(transfers)
}