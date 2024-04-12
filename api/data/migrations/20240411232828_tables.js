exports.up = function (knex) {
    return knex.schema
        .createTable('User', User => {
            User.increments('user_id')
            User.string('email', 30).notNullable().unique()
            User.string('password', 30).notNullable()
            User.string('user_type', 7).notNullable()
        })
        .createTable('Client', Client => {
            Client.increments('client_id')
            Client.string('first_name', 50).notNullable()
            Client.string('last_name', 50).notNullable()
            Client.string('phone_num', 14).notNullable()
            Client.string('cell_num', 14).notNullable()
            Client.string('email', 30).notNullable()
                .unique()
                .references('email')
                .inTable('User')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')

            Client.string('city', 20).notNullable()
            Client.string('state', 15).notNullable()
            Client.string('street_addr', 20).notNullable()
            Client.integer('zip_code').notNullable()
            Client.decimal('USD_balance', 10, 2).notNullable().default(0)
            Client.decimal('Bitcoin_balance', 10, 2).notNullable().default(0)
            Client.string('mem_level', 6).notNullable()
            Client.integer('num_trades').notNullable()
        })
        .createTable('Trader', Trader => {
            Trader.increments('trader_id')
            Trader.string('first_name', 50).notNullable()
            Trader.string('last_name', 50).notNullable()
            Trader.string('phone_num', 14).notNullable()
            Trader.string('cell_num', 14).notNullable()
            Trader.string('email', 30).notNullable()
                .unique()
                .references('email')
                .inTable('User')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')
            Trader.string('city', 20).notNullable()
            Trader.string('state', 15).notNullable()
            Trader.string('street_addr', 20).notNullable()
            Trader.integer('zip_code').notNullable()
            Trader.decimal('USD_balance', 10, 2).notNullable().default(0)
            Trader.decimal('Bitcoin_balance', 10, 2).notNullable().default(0)
            Trader.decimal('transfer_balance', 10, 2).notNullable().default(0)


        })
        .createTable('Order', Order => {
            Order.increments('order_id')
            Order.integer('client_id').notNullable()
            Order.date('date').notNullable()
            Order.decimal('comm_paid', 10, 2).notNullable().default(0)
            Order.string('comm_type', 7).notNullable()
            Order.decimal('Bitcoin_balance', 10, 2).notNullable().default(0)
            Order.boolean('isCancelled').notNullable()
        })


}



exports.down = function (knex) {

};
