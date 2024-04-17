const date = new Date()
const formattedDate = `${date.getFullYear()}` + '-' + `${date.getMonth()}` + '-' + `${date.getDate()}`

const transfers = [
    {
        transac_id: 1,
        client_id: 1,
        trader_id: 1,
        amount_paid: 20000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: false

    },
    {
        transac_id: 2,
        client_id: 2,
        trader_id: 1,
        amount_paid: 30000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: true

    },
    {
        transac_id: 3,
        client_id: 3,
        trader_id: 1,
        amount_paid: 60000.00,
        date: formattedDate,
        isCancelled: true,
        isInvested: false

    },
    {
        transac_id: 4,
        client_id: 4,
        trader_id: 1,
        amount_paid: 30000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: true

    },
    {
        transac_id: 5,
        client_id: 5,
        trader_id: 1,
        amount_paid: 20000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: false

    },
    {
        transac_id: 6,
        client_id: 6,
        trader_id: 2,
        amount_paid: 15000.00,
        date: formattedDate,
        isCancelled: true,
        isInvested: false

    },
    {
        transac_id: 7,
        client_id: 7,
        trader_id: 2,
        amount_paid: 10000.00,
        date: formattedDate,
        isCancelled: true,
        isInvested: false

    },
    {
        transac_id: 8,
        client_id: 8,
        trader_id: 2,
        amount_paid: 30000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: false

    },
    {
        transac_id: 9,
        client_id: 9,
        trader_id: 2,
        amount_paid: 40000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: true

    },
    {
        transac_id: 10,
        client_id: 10,
        trader_id: 2,
        amount_paid: 10000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: false

    },
    {
        transac_id: 11,
        client_id: 11,
        trader_id: 3,
        amount_paid: 5000.00,
        date: formattedDate,
        isCancelled: true,
        isInvested: false

    },
    {
        transac_id: 12,
        client_id: 12,
        trader_id: 3,
        amount_paid: 25000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: true

    },
    {
        transac_id: 13,
        client_id: 13,
        trader_id: 3,
        amount_paid: 10000.00,
        date: formattedDate,
        isCancelled: true,
        isInvested: false

    },
    {
        transac_id: 14,
        client_id: 14,
        trader_id: 3,
        amount_paid: 50000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: true

    },
    {
        transac_id: 15,
        client_id: 15,
        trader_id: 3,
        amount_paid: 45000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: false

    },
    {
        transac_id: 16,
        client_id: 16,
        trader_id: 4,
        amount_paid: 5000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: true

    },
    {
        transac_id: 17,
        client_id: 17,
        trader_id: 4,
        amount_paid: 10000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: false

    },
    {
        transac_id: 18,
        client_id: 18,
        trader_id: 4,
        amount_paid: 30000.00,
        date: formattedDate,
        isCancelled: true,
        isInvested: false

    },
    {
        transac_id: 19,
        client_id: 19,
        trader_id: 4,
        amount_paid: 15000.00,
        date: formattedDate,
        isCancelled: false,
        isInvested: true

    },
    {
        transac_id: 20,
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