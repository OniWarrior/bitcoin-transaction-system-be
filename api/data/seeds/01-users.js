const users = [
    {
        user_id: 1,
        email: 'johnson_bryon@gmail.com',
        password: '456123',
        user_type: 'Client'
    },
    {
        user_id: 2,
        email: 'helloThere@gmail.com',
        password: '789456',
        user_type: 'Client'
    },
    {
        user_id: 3,
        email: 'gork@yahoo.com',
        password: '741852',
        user_type: 'Trader'

    },
    {
        user_id: 4,
        email: 'kirsche@gmail.com',
        password: '852963',
        user_type: 'Trader'
    },
    {
        user_id: 5,
        email: 'blabs@gmail.com',
        password: 'abc123',
        user_type: "Client"

    },
    {
        user_id: 6,
        email: 'stutteringcraig@gmail.com',
        password: 'qwr789',
        user_type: 'Client'

    },
    {
        user_id: 7,
        email: 'boom@gmail.com',
        password: 'tyu456',
        user_type: 'Client'
    },
    {
        user_id: 8,
        email: 'sonic@gmail.com',
        password: 'ert741',
        user_type: 'Client'
    },
    {
        user_id: 9,
        email: 'tails@gmail.com',
        password: 'bnm789',
        user_type: 'Client'
    },
    {
        user_id: 10,
        email: 'knuckles@gmail.com',
        password: 'qaz123',
        user_type: 'Client'
    },
    {
        user_id: 11,
        email: 'rouge@gmail.com',
        password: 'ujn123',
        user_type: 'Client'
    },
    {
        user_id: 12,
        email: 'bongo@gmail.com',
        password: 'plm123',
        user_type: 'Client'
    },
    {
        user_id: 13,
        email: 'maumua@gmail.com',
        password: 'tgb123456',
        user_type: 'Client'
    },
    {
        user_id: 14,
        email: 'robotnick@gmail.com',
        password: 'qasw123',
        user_type: 'Client'
    },
    {
        user_id: 15,
        email: 'shadow@gmail.com',
        password: 'rfvb123',
        user_type: 'Client'
    },
    {
        user_id: 16,
        email: 'oingoboingo@gmail.com',
        password: 'okmlp123',
        user_type: 'Client'
    },
    {
        user_id: 17,
        email: 'winston@gmail.com',
        password: 'room101',
        user_type: 'Client'
    },
    {
        user_id: 18,
        email: 'julia@gmail.com',
        password: 'airstrip101',
        user_type: 'Client'
    },
    {
        user_id: 19,
        email: 'bilbo@gmail.com',
        password: 'ingsoc123',
        user_type: 'Client'
    },
    {
        user_id: 20,
        email: 'gandolf@gmail.com',
        password: 'mordor@gmail.com',
        user_type: 'Client'
    },
    {
        user_id: 21,
        email: 'frodo@gmail.com',
        password: 'shire456',
        user_type: 'Client'
    },
    {
        user_id: 22,
        email: 'aragorn@gmail.com',
        password: 'elf345',
        user_type: 'Client'
    }

    ,
    {
        user_id: 23,
        email: 'sidescrollers@gmail.com',
        password: '963852',
        user_type: 'Manager'
    },
    {
        user_id: 24,
        email: 'donkeykong@gmail.com',
        password: 'dk1234',
        user_type: 'Trader'
    },
    {
        user_id: 25,
        email: 'diddykong@gmail.com',
        password: 'diddy123',
        user_type: 'Trader'
    }


]




exports.seed = function (knex) {
    return knex('User').insert(users)
}