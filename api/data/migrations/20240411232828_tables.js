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
                .references('client_id')
                .inTable('Client')
                .onUpdate('CASCADE')
            onDelete('CASCADE')
            Order.date('date').notNullable()
            Order.decimal('comm_paid', 10, 2).notNullable().default(0)
            Order.string('comm_type', 7).notNullable()
            Order.decimal('Bitcoin_balance', 10, 2).notNullable().default(0)
            Order.boolean('isCancelled').notNullable()
        })
        .createTable('Transfer', Transfer => {
            Transfer.increments('transac_id')
            Transfer.integer('client_id').notNullable()
                .references('client_id')
                .inTable('Client')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')
            Transfer.integer('trader_id').notNullable()
                .notNullable()
                .references('trader_id')
                .inTable('Trader')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')
            Transfer.decimal('amount_paid', 10, 2).notNullable().default(0)
            Transfer.date('date').notNullable()
            Transfer.boolean('isCancelled').notNullable()
            Transfer.boolean('isInvested').notNullable()
        })
        .createTable('Cancel_log', Cancel_log => {
            Cancel_log.increments('log_id')
            Cancel_log.integer('order_id').nullable()
            Cancel_log.integer('client_id').nullable()
            Cancel_log.integer('trader_id').nullable()
            Cancel_log.integer('transac_id').nullable()
            Cancel_log.date('date').notNullable()
            Cancel_log.decimal('comm_paid', 10, 2).nullable()
            Cancel_log.string('comm_type', 7).nullable()
            Cancel_log.decimal('Bitcoin_balance', 10, 2).nullable()
            Cancel_log.decimal('amount_paid', 10, 2).nullable()
            Cancel_log.boolean('isCancelled').nullable()
            Cancel_log.boolean('isInvested').nullable()

        })



}



exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('Cancel_log')
        .dropTableIfExists('Transfer')
        .dropTableIfExists('Order')
        .dropTableIfExists('Trader')
        .dropTableIfExists('Client')
        .dropTableIfExists('User')

};
