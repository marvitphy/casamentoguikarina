const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'mysql742.umbler.com:41890' || 'localhost',
        user: 'casaguika' || 'root',
        password: 'markim123' || '',
        database: 'casaguika'
    },
    pool: { min: 0, max: 10 },
});

module.exports = knex