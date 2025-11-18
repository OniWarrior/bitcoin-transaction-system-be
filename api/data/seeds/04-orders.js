
const date = new Date()
const formattedDate = `${date.getFullYear()}` + '-' + `${date.getMonth()}` + '-' + `${date.getDate()}`
const orders = [
    {

        client_id: 1,
        date: formattedDate,
        comm_paid: 0.20,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 2.00,
        isCancelled: false

    },
    {

        client_id: 1,
        date: formattedDate,
        comm_paid: 32614.50,
        comm_type: 'USD',
        Bitcoin_balance: 5.00,
        isCancelled: true


    },
    {

        client_id: 2,
        date: formattedDate,
        comm_paid: 32614.5,
        comm_type: 'USD',
        Bitcoin_balance: 5.00,
        isCancelled: false

    },
    {

        client_id: 2,
        date: formattedDate,
        comm_paid: 0.60,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 6,
        isCancelled: true
    },
    {

        client_id: 3,
        date: formattedDate,
        comm_paid: 0.10,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 2.00,
        isCancelled: false

    },
    {

        client_id: 3,
        date: formattedDate,
        comm_paid: 0.40,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 8.00,
        isCancelled: true

    },
    {

        client_id: 4,
        date: formattedDate,
        comm_paid: 26091.60,
        comm_type: 'USD',
        Bitcoin_balance: 4.00,
        isCancelled: false

    },
    {

        client_id: 4,
        date: formattedDate,
        comm_paid: 19568.70,
        comm_type: 'USD',
        Bitcoin_balance: 3.00,
        isCancelled: true

    },
    {

        client_id: 5,
        date: formattedDate,
        comm_paid: 0.90,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 9.00,
        isCancelled: false

    },
    {

        client_id: 5,
        date: formattedDate,
        comm_paid: 0.50,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 5.00,
        isCancelled: true

    },
    {

        client_id: 6,
        date: formattedDate,
        comm_paid: 9784.35,
        comm_type: 'USD',
        Bitcoin_balance: 3.00,
        isCancelled: false

    },
    {

        client_id: 6,
        date: formattedDate,
        comm_paid: 0.30,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 6.00,
        isCancelled: true

    },
    {

        client_id: 7,
        date: formattedDate,
        comm_paid: 0.10,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 1.00,
        isCancelled: false

    },
    {

        client_id: 7,
        date: formattedDate,
        comm_paid: 0.80,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 8.00,
        isCancelled: true

    },
    {

        client_id: 8,
        date: formattedDate,
        comm_paid: 16307.25,
        comm_type: 'USD',
        Bitcoin_balance: 5.00,
        isCancelled: false

    },
    {

        client_id: 8,
        date: formattedDate,
        comm_paid: 0.10,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 2.00,
        isCancelled: true

    },
    {

        client_id: 9,
        date: formattedDate,
        comm_paid: 0.30,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 3.00,
        isCancelled: false

    },
    {

        client_id: 9,
        date: formattedDate,
        comm_paid: 0.50,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 5.00,
        isCancelled: true

    },
    {

        client_id: 10,
        date: formattedDate,
        comm_paid: 0.10,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 1.00,
        isCancelled: false

    },
    {

        client_id: 10,
        date: formattedDate,
        comm_paid: 0.60,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 6.00,
        isCancelled: true

    },
    {

        client_id: 11,
        date: formattedDate,
        comm_paid: 19568.70,
        comm_type: 'USD',
        Bitcoin_balance: 3.00,
        isCancelled: false

    },
    {

        client_id: 11,
        date: formattedDate,
        comm_paid: 65229.00,
        comm_type: 'USD',
        Bitcoin_balance: 10.00,
        isCancelled: true

    },
    {

        client_id: 12,
        date: formattedDate,
        comm_paid: 9784.35,
        comm_type: 'USD',
        Bitcoin_balance: 3.00,
        isCancelled: false

    },
    {

        client_id: 12,
        date: formattedDate,
        comm_paid: 16307.25,
        comm_type: 'USD',
        Bitcoin_balance: 5.00,
        isCancelled: true

    },
    {

        client_id: 13,
        date: formattedDate,
        comm_paid: 0.10,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 1.00,
        isCancelled: false

    },
    {

        client_id: 13,
        date: formattedDate,
        comm_paid: 0.30,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 3.00,
        isCancelled: true

    },
    {

        client_id: 14,
        date: formattedDate,
        comm_paid: 0.25,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 5.00,
        isCancelled: false

    },
    {

        client_id: 14,
        date: formattedDate,
        comm_paid: 0.15,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 3.00,
        isCancelled: true

    },
    {

        client_id: 15,
        date: formattedDate,
        comm_paid: 19568.70,
        comm_type: 'USD',
        Bitcoin_balance: 3.00,
        isCancelled: false

    },
    {

        client_id: 15,
        date: formattedDate,
        comm_paid: 65229.00,
        comm_type: 'USD',
        Bitcoin_balance: 10.00,
        isCancelled: true

    },
    {

        client_id: 16,
        date: formattedDate,
        comm_paid: 0.20,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 2.00,
        isCancelled: false

    },
    {

        client_id: 16,
        date: formattedDate,
        comm_paid: 0.50,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 5.00,
        isCancelled: true

    },
    {

        client_id: 17,
        date: formattedDate,
        comm_paid: 39137.40,
        comm_type: 'USD',
        Bitcoin_balance: 6.00,
        isCancelled: false

    },
    {

        client_id: 17,
        date: formattedDate,
        comm_paid: 0.20,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 2.00,
        isCancelled: true

    },
    {

        client_id: 18,
        date: formattedDate,
        comm_paid: 0.15,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 3.00,
        isCancelled: false

    },
    {

        client_id: 18,
        date: formattedDate,
        comm_paid: 0.05,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 1.00,
        isCancelled: true

    },
    {

        client_id: 19,
        date: formattedDate,
        comm_paid: 0.50,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 5.00,
        isCancelled: false

    },
    {

        client_id: 19,
        date: formattedDate,
        comm_paid: 1.00,
        comm_type: 'Bitcoin',
        Bitcoin_balance: 10.00,
        isCancelled: true

    },
    {

        client_id: 20,
        date: formattedDate,
        comm_paid: 19568.70,
        comm_type: 'USD',
        Bitcoin_balance: 3.00,
        isCancelled: false

    },
    {

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