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
        email: 'sidescrollers@gmail.com',
        password: '963852',
        user_type: 'Manager'
    }


]




exports.seed = function (knex) {
    return knex('User').insert(users)
}