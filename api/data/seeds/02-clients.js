
const clients = [
    {
        client_id: 1,
        first_name: 'john',
        last_name: 'bryon',
        phone_num: '(214)-111-2222',
        cell_num: '(514)-333-4444',
        email: 'johnson_bryon@gmail.com',
        city: 'Dallas',
        state: 'Texas',
        street_addr: ' 2015 hello ln',
        zip_code: '75050',
        Bitcoin_balance: 10.00,
        USD_balance: 100000.00,
        mem_level: 'Silver',
        num_trades: 5
    },
    {
        client_id: 2,
        first_name: 'Dennis',
        last_name: 'Ritchie',
        phone_num: '(214)-888-8888',
        cell_num: '(817)-333-4444',
        email: 'helloThere@gmail.com',
        city: 'Fort Worth',
        state: 'Texas',
        street_addr: ' 2020 kawaii ln',
        zip_code: '75050',
        Bitcoin_balance: 15.00,
        USD_balance: 300000.00,
        mem_level: 'Silver',
        num_trades: 10

    },

    {
        client_id: 3,
        first_name: 'Chelsey',
        last_name: 'Jacobsen',
        phone_num: '(214)-999-9999',
        cell_num: '(817)-111-1111',
        email: 'blabs@gmail.com',
        city: 'Fort Worth',
        state: 'Texas',
        street_addr: ' 2023 kawaii ln',
        zip_code: '76118',
        Bitcoin_balance: 20.00,
        USD_balance: 1000000.00,
        mem_level: 'Gold',
        num_trades: 20
    },

    {
        client_id: 4,
        first_name: 'Craig',
        last_name: 'Jones',
        phone_num: '(214)-111-2222',
        cell_num: '(514)-333-4444',
        email: 'stutteringcraig@gmail.com',
        city: 'Dallas',
        state: 'Texas',
        street_addr: ' 2019 oahu ln',
        zip_code: '76118',
        Bitcoin_balance: 11.00,
        USD_balance: 100000.00,
        mem_level: 'Silver',
        num_trades: 5
    },
    {
        client_id: 5,
        first_name: 'John',
        last_name: 'Smith',
        phone_num: '(972)-888-8888',
        cell_num: '(469)-333-4444',
        email: 'boom@gmail.com',
        city: 'Fort Worth',
        state: 'Texas',
        street_addr: ' 2028 kawaii ln',
        zip_code: '75050',
        Bitcoin_balance: 15.00,
        USD_balance: 300000.00,
        mem_level: 'Silver',
        num_trades: 10

    },

    {
        client_id: 6,
        first_name: 'Brian',
        last_name: 'Kernigan',
        phone_num: '(699)-999-9999',
        cell_num: '(972)-111-1111',
        email: 'sonic@gmail.com',
        city: 'Dallas',
        state: 'Texas',
        street_addr: ' 2000 big island ln',
        zip_code: '75050',
        Bitcoin_balance: 20.00,
        USD_balance: 1000000.00,
        mem_level: 'Gold',
        num_trades: 20
    },
    {
        client_id: 7,
        first_name: 'Jake',
        last_name: 'Mallory',
        phone_num: '(215)-111-2222',
        cell_num: '(515)-333-4444',
        email: 'tails@gmail.com',
        city: 'Grand Prairie',
        state: 'Texas',
        street_addr: ' 3000 big lake dr',
        zip_code: '75050',
        Bitcoin_balance: 9.00,
        USD_balance: 50000.00,
        mem_level: 'Silver',
        num_trades: 4
    },
    {
        client_id: 8,
        first_name: 'John',
        last_name: 'Bonham',
        phone_num: '(213)-888-8888',
        cell_num: '(816)-333-4444',
        email: 'knuckles@gmail.com',
        city: 'Fort Worth',
        state: 'Texas',
        street_addr: ' 4000 kawaii ln',
        zip_code: '76118',
        Bitcoin_balance: 25.00,
        USD_balance: 3000000.00,
        mem_level: 'Gold',
        num_trades: 35

    },

    {
        client_id: 9,
        first_name: 'John',
        last_name: 'Johns',
        phone_num: '(114)-111-9999',
        cell_num: '(817)-111-9999',
        email: 'rouge@gmail.com',
        city: 'Grand Prairie',
        state: 'Texas',
        street_addr: ' 6000 ebby ln',
        zip_code: '75050',
        Bitcoin_balance: 3.00,
        USD_balance: 30000.00,
        mem_level: 'Silver',
        num_trades: 2
    },
    {
        client_id: 10,
        first_name: 'john',
        last_name: 'bryon',
        phone_num: '(214)-196-2222',
        cell_num: '(514)-896-4444',
        email: 'bongo@gmail.com',
        city: 'Dallas',
        state: 'Texas',
        street_addr: ' 6000 don ln',
        zip_code: '75019',
        Bitcoin_balance: 5.00,
        USD_balance: 25000.00,
        mem_level: 'Silver',
        num_trades: 6
    },
    {
        client_id: 11,
        first_name: 'Abe',
        last_name: 'Lincoln',
        phone_num: '(666)-888-8888',
        cell_num: '(666)-333-4444',
        email: 'maumua@gmail.com',
        city: 'Fort Worth',
        state: 'Texas',
        street_addr: ' 1000 legacy ln',
        zip_code: '76118',
        Bitcoin_balance: 10.00,
        USD_balance: 300000.00,
        mem_level: 'Silver',
        num_trades: 10

    },

    {
        client_id: 12,
        first_name: 'Ivan',
        last_name: 'Drago',
        phone_num: '(214)-555-5555',
        cell_num: '(817)-888-8888',
        email: 'robotnick@gmail.com',
        city: 'Grand Prairie',
        state: 'Texas',
        street_addr: ' 2050 kawaii ln',
        zip_code: '75050',
        Bitcoin_balance: 40.00,
        USD_balance: 1000000.00,
        mem_level: 'Gold',
        num_trades: 40
    },

    {
        client_id: 13,
        first_name: 'Stephen',
        last_name: 'Johnson',
        phone_num: '(999)-111-2222',
        cell_num: '(333)-333-4444',
        email: 'shadow@gmail.com',
        city: 'Dallas',
        state: 'Texas',
        street_addr: ' 5060 hell ln',
        zip_code: '75032',
        Bitcoin_balance: 10.00,
        USD_balance: 100000.00,
        mem_level: 'Silver',
        num_trades: 5
    },
    {
        client_id: 14,
        first_name: 'James',
        last_name: 'Sunderland',
        phone_num: '(888)-888-8888',
        cell_num: '(789)-333-4444',
        email: 'oingoboingo@gmail.com',
        city: 'Fort Worth',
        state: 'Texas',
        street_addr: ' 1010 courtesy ln',
        zip_code: '76118',
        Bitcoin_balance: 19.00,
        USD_balance: 3000000.00,
        mem_level: 'Gold',
        num_trades: 33

    },

    {
        client_id: 15,
        first_name: 'Winston',
        last_name: 'Churchill',
        phone_num: '(214)-999-9999',
        cell_num: '(817)-111-1111',
        email: 'winston@gmail.com',
        city: 'Fort Worth',
        state: 'Texas',
        street_addr: ' 6214 Tokyo ln',
        zip_code: '76118',
        Bitcoin_balance: 2.50,
        USD_balance: 10000.00,
        mem_level: 'Silver',
        num_trades: 3
    },

    {
        client_id: 16,
        first_name: 'Julia',
        last_name: 'Bond',
        phone_num: '(972)-444-2222',
        cell_num: '(469)-333-4444',
        email: 'julia@gmail.com',
        city: 'Dallas',
        state: 'Texas',
        street_addr: ' 2222 Doom ln',
        zip_code: '75052',
        Bitcoin_balance: 10.00,
        USD_balance: 100000.00,
        mem_level: 'Silver',
        num_trades: 5
    },
    {
        client_id: 17,
        first_name: 'Bilbo',
        last_name: 'Baggins',
        phone_num: '(214)-123-4567',
        cell_num: '(817)-123-4567',
        email: 'bilbo@gmail.com',
        city: 'Grand Prairie',
        state: 'Texas',
        street_addr: ' 2020 kawaii ln',
        zip_code: '75050',
        Bitcoin_balance: 13.60,
        USD_balance: 40000.00,
        mem_level: 'Silver',
        num_trades: 10

    },

    {
        client_id: 18,
        first_name: 'Gandolf',
        last_name: 'Vinar',
        phone_num: '(214)-654-9874',
        cell_num: '(817)-369-9874',
        email: 'gandolf@gmail.com',
        city: 'Grand Prairie',
        state: 'Texas',
        street_addr: ' 1100 Lala ln',
        zip_code: '75050',
        Bitcoin_balance: 28.00,
        USD_balance: 10000000.00,
        mem_level: 'Gold',
        num_trades: 26
    },
    {
        client_id: 19,
        first_name: 'Frodo',
        last_name: 'Baggins',
        phone_num: '(214)-745-2222',
        cell_num: '(514)-333-9856',
        email: 'frodo@gmail.com',
        city: 'Dallas',
        state: 'Texas',
        street_addr: ' 9685 John ln',
        zip_code: '75053',
        Bitcoin_balance: 10.00,
        USD_balance: 100000.00,
        mem_level: 'Silver',
        num_trades: 5
    },
    {
        client_id: 20,
        first_name: 'Aragorn',
        last_name: 'Ranger',
        phone_num: '(214)-736-8736',
        cell_num: '(817)-333-4444',
        email: 'aragorn@gmail.com',
        city: 'Fort Worth',
        state: 'Texas',
        street_addr: ' 8596 western ln',
        zip_code: '76118',
        Bitcoin_balance: 9.00,
        USD_balance: 400000.00,
        mem_level: 'Silver',
        num_trades: 9

    }




]






exports.seed = function (knex) {
    return knex('Client').insert(clients)
}