const bcrypt = require('bcrypt')







let users = [
    {

        email: 'johnson_bryon@gmail.com',
        password: '456123',
        user_type: 'Client'
    },
    {

        email: 'helloThere@gmail.com',
        password: '789456',
        user_type: 'Client'
    },
    {

        email: 'gork@yahoo.com',
        password: '741852',
        user_type: 'Trader'

    },
    {

        email: 'kirsche@gmail.com',
        password: '852963',
        user_type: 'Trader'
    },
    {

        email: 'blabs@gmail.com',
        password: 'abc123',
        user_type: "Client"

    },
    {

        email: 'stutteringcraig@gmail.com',
        password: 'qwr789',
        user_type: 'Client'

    },
    {

        email: 'boom@gmail.com',
        password: 'tyu456',
        user_type: 'Client'
    },
    {

        email: 'sonic@gmail.com',
        password: 'ert741',
        user_type: 'Client'
    },
    {

        email: 'tails@gmail.com',
        password: 'bnm789',
        user_type: 'Client'
    },
    {

        email: 'knuckles@gmail.com',
        password: 'qaz123',
        user_type: 'Client'
    },
    {

        email: 'rouge@gmail.com',
        password: 'ujn123',
        user_type: 'Client'
    },
    {

        email: 'bongo@gmail.com',
        password: 'plm123',
        user_type: 'Client'
    },
    {

        email: 'maumua@gmail.com',
        password: 'tgb123456',
        user_type: 'Client'
    },
    {

        email: 'robotnick@gmail.com',
        password: 'qasw123',
        user_type: 'Client'
    },
    {

        email: 'shadow@gmail.com',
        password: 'rfvb123',
        user_type: 'Client'
    },
    {

        email: 'oingoboingo@gmail.com',
        password: 'okmlp123',
        user_type: 'Client'
    },
    {

        email: 'winston@gmail.com',
        password: 'room101',
        user_type: 'Client'
    },
    {

        email: 'julia@gmail.com',
        password: 'airstrip101',
        user_type: 'Client'
    },
    {

        email: 'bilbo@gmail.com',
        password: 'ingsoc123',
        user_type: 'Client'
    },
    {

        email: 'gandolf@gmail.com',
        password: 'mordor@gmail.com',
        user_type: 'Client'
    },
    {

        email: 'frodo@gmail.com',
        password: 'shire456',
        user_type: 'Client'
    },
    {

        email: 'aragorn@gmail.com',
        password: 'elf345',
        user_type: 'Client'
    }

    ,
    {

        email: 'sidescrollers@gmail.com',
        password: '963852',
        user_type: 'Manager'
    },
    {

        email: 'donkeykong@gmail.com',
        password: 'dk1234',
        user_type: 'Trader'
    },
    {

        email: 'diddykong@gmail.com',
        password: 'diddy123',
        user_type: 'Trader'
    }


]

// loop through array of objects and assign hashed passwords
for (let i = 0; i < users.length - 1; i++) {
    const rounds = parseInt(process.env.ROUNDS)
    const hash = bcrypt.hashSync(users[i].password, rounds)
    const hashedPassword = hash
    users[i].password = hashedPassword
}



exports.seed = function (knex) {
    return knex('User').insert(users)
}