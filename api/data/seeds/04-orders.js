
const date = new Date()
const formattedDate = `${date.getFullYear()}` + '-' + `${date.getMonth()}` + '-' + `${date.getDate()}`
const orders = [
    {
        order_id: 1,
        client_id: 1,
        date: formattedDate,
        comm_paid: 0.20,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 2.00,
        isCancelled: false

    },
    {
        order_id: 2,
        client_id: 1,
        date: formattedDate,
        comm_paid: 32614.50,
        comm_type: 'USD',
        Bitcoin_balance: 5.00,
        isCancelled: true


    },
    {
        order_id: 3,
        client_id: 2,
        date: formattedDate,
        comm_paid: 32614.5,
        comm_type: 'USD',
        Bitcoin_balance: 5.00,
        isCancelled: false

    },
    {
        order_id: 4,
        client_id: 2,
        date: formattedDate,
        comm_paid: 0.60,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 6,
        isCancelled: true
    },
    {
        order_id: 5,
        client_id: 3,
        date: formattedDate,
        comm_paid: 0.10,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 2.00,
        isCancelled: false

    },
    {
        order_id: 6,
        client_id: 3,
        date: formattedDate,
        comm_paid: 0.40,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 8.00,
        isCancelled: true

    },
    {
        order_id: 7,
        client_id: 4,
        date: formattedDate,
        comm_paid: 26091.60,
        comm_type: 'USD',
        Bitcoin_balance: 4.00,
        isCancelled: false

    },
    {
        order_id: 8,
        client_id: 4,
        date: formattedDate,
        comm_paid: 19568.70,
        comm_type: 'USD',
        Bitcoin_balance: 3.00,
        isCancelled: true

    },
    {
        order_id: 9,
        client_id: 5,
        date: formattedDate,
        comm_paid: 0.90,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 9.00,
        isCancelled: false

    },
    {
        order_id: 10,
        client_id: 5,
        date: formattedDate,
        comm_paid: 0.50,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 5.00,
        isCancelled: true

    },
    {
        order_id: 11,
        client_id: 6,
        date: formattedDate,
        comm_paid: 9784.35,
        comm_type: 'USD',
        Bitcoin_balance: 3.00,
        isCancelled: false

    },
    {
        order_id: 12,
        client_id: 6,
        date: formattedDate,
        comm_paid: 0.30,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 6.00,
        isCancelled: true

    },
    {
        order_id: 13,
        client_id: 7,
        date: formattedDate,
        comm_paid: 0.10,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 1.00,
        isCancelled: false

    },
    {
        order_id: 14,
        client_id: 7,
        date: formattedDate,
        comm_paid: 0.80,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 8.00,
        isCancelled: true

    },
    {
        order_id: 15,
        client_id: 8,
        date: formattedDate,
        comm_paid: 16307.25,
        comm_type: 'USD',
        Bitcoin_balance: 5.00,
        isCancelled: false

    },
    {
        order_id: 16,
        client_id: 8,
        date: formattedDate,
        comm_paid: 0.10,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 2.00,
        isCancelled: true

    },
    {
        order_id: 17,
        client_id: 9,
        date: formattedDate,
        comm_paid: 0.30,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 3.00,
        isCancelled: false

    },
    {
        order_id: 18,
        client_id: 9,
        date: formattedDate,
        comm_paid: 0.50,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 5.00,
        isCancelled: true

    },
    {
        order_id: 19,
        client_id: 10,
        date: formattedDate,
        comm_paid: 0.10,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 1.00,
        isCancelled: false

    },
    {
        order_id: 20,
        client_id: 10,
        date: formattedDate,
        comm_paid: 0.60,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 6.00,
        isCancelled: true

    },
    {
        order_id: 21,
        client_id: 11,
        date: formattedDate,
        comm_paid: 19568.70,
        comm_type: 'USD',
        Bitcoin_balance: 3.00,
        isCancelled: false

    },
    {
        order_id: 22,
        client_id: 11,
        date: formattedDate,
        comm_paid: 65229.00,
        comm_type: 'USD',
        Bitcoin_balance: 10.00,
        isCancelled: true

    },
    {
        order_id: 23,
        client_id: 12,
        date: formattedDate,
        comm_paid: 9784.35,
        comm_type: 'USD',
        Bitcoin_balance: 3.00,
        isCancelled: false

    },
    {
        order_id: 24,
        client_id: 12,
        date: formattedDate,
        comm_paid: 16307.25,
        comm_type: 'USD',
        Bitcoin_balance: 5.00,
        isCancelled: true

    },
    {
        order_id: 25,
        client_id: 13,
        date: formattedDate,
        comm_paid: 0.10,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 1.00,
        isCancelled: false

    },
    {
        order_id: 26,
        client_id: 13,
        date: formattedDate,
        comm_paid: 0.30,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 3.00,
        isCancelled: true

    },
    {
        order_id: 27,
        client_id: 14,
        date: formattedDate,
        comm_paid: 0.25,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 5.00,
        isCancelled: false

    },
    {
        order_id: 28,
        client_id: 14,
        date: formattedDate,
        comm_paid: 0.15,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 3.00,
        isCancelled: true

    },
    {
        order_id: 29,
        client_id: 15,
        date: formattedDate,
        comm_paid: 19568.70,
        comm_type: 'USD',
        Bitcoin_balance: 3.00,
        isCancelled: false

    },
    {
        order_id: 30,
        client_id: 15,
        date: formattedDate,
        comm_paid: 65229.00,
        comm_type: 'USD',
        Bitcoin_balance: 10.00,
        isCancelled: true

    },
    {
        order_id: 31,
        client_id: 16,
        date: formattedDate,
        comm_paid: 0.20,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 2.00,
        isCancelled: false

    },
    {
        order_id: 32,
        client_id: 16,
        date: formattedDate,
        comm_paid: 0.50,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 5.00,
        isCancelled: true

    },
    {
        order_id: 33,
        client_id: 17,
        date: formattedDate,
        comm_paid: 39137.40,
        comm_type: 'USD',
        Bitcoin_balance: 6.00,
        isCancelled: false

    },
    {
        order_id: 34,
        client_id: 17,
        date: formattedDate,
        comm_paid: 0.20,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 2.00,
        isCancelled: true

    },
    {
        order_id: 35,
        client_id: 18,
        date: formattedDate,
        comm_paid: 0.15,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 3.00,
        isCancelled: false

    },
    {
        order_id: 36,
        client_id: 18,
        date: formattedDate,
        comm_paid: 0.05,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 1.00,
        isCancelled: true

    },
    {
        order_id: 37,
        client_id: 19,
        date: formattedDate,
        comm_paid: 0.50,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 5.00,
        isCancelled: false

    },
    {
        order_id: 38,
        client_id: 19,
        date: formattedDate,
        comm_paid: 1.00,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 10.00,
        isCancelled: true

    },
    {
        order_id: 39,
        client_id: 20,
        date: formattedDate,
        comm_paid: 19568.70,
        comm_type: 'USD',
        Bitcoin_balance: 3.00,
        isCancelled: false

    },
    {
        order_id: 40,
        client_id: 20,
        date: formattedDate,
        comm_paid: 32614.50,
        comm_type: 'USD',
        Bitcoin_balance: 5.00,
        isCancelled: true

    }


]

exports.seed = function (knex) {
    return knex('Order').insert(orders)
}