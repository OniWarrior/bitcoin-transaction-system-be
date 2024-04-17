
const traders = [
    {
        trader_id: 1,
        first_name: 'Sauron',
        last_name: 'Elfson',
        phone_num: '(214)-321-6262',
        cell_num: '(817)-321-6262',
        email: 'gork@yahoo.com',
        city: 'Fort Worth',
        state: 'Texas',
        street_addr: ' 9636 Skylark ln',
        zip_code: '76118',
        Bitcoin_balance: 9.00,
        USD_balance: 400000.00,
        transfer_balance: 20000.00

    },
    {
        trader_id: 2,
        first_name: 'Kirsche',
        last_name: 'Vahl',
        phone_num: '(214)-969-6262',
        cell_num: '(817)-969-6262',
        email: 'kirsche@gmail.com',
        city: 'Dallas',
        state: 'Texas',
        street_addr: ' 6253 Dawn ln',
        zip_code: '75053',
        Bitcoin_balance: 12.00,
        USD_balance: 400965.00,
        transfer_balance: 50000.00

    },
    {
        trader_id: 3,
        first_name: 'Donkey',
        last_name: 'Kong',
        phone_num: '(352)-321-6262',
        cell_num: '(596)-321-6262',
        email: 'donkeykong@gmail.com',
        city: 'Fort Worth',
        state: 'Texas',
        street_addr: ' 1234 Winter ln',
        zip_code: '76118',
        Bitcoin_balance: 20.00,
        USD_balance: 1000000.00,
        transfer_balance: 100000.00

    },
    {
        trader_id: 4,
        first_name: 'Diddy',
        last_name: 'Kong',
        phone_num: '(214)-753-9512',
        cell_num: '(817)-753-9512',
        email: 'diddykong@gmail.com',
        city: 'Grand Prairie',
        state: 'Texas',
        street_addr: ' 4321 Summer ln',
        zip_code: '75050',
        Bitcoin_balance: 9.00,
        USD_balance: 400654.00,
        transfer_balance: 60000.00

    }
]



exports.seed = function (knex) {
    return knex('Trader').insert(traders)
}