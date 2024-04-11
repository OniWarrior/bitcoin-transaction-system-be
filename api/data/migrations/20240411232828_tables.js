exports.up = function (knex) {
    return knex.schema
        .createTable('User', User => {
            User.increments('user_id')
            User.string('email', 30).notNullable().unique()
            User.string('password', 30).notNullable()
            User.string('user_type', 7).notNullable().unique()
        })


}



exports.down = function (knex) {

};
