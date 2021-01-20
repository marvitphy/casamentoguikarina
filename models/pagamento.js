const knex = require('../db')


function cadPag(valor) {
    return knex('pagamentos').insert({ valor: valor })
        .then(result => result)
        .catch(err => err)
}

function total(valor) {
    return knex('total').where({ id: 1 }).update({ valor: valor })
        .then(result => result)
        .catch(err => err)
}

function getTotal(valor) {
    return knex('total').select()
        .then(result => result)
        .catch(err => err)
}


module.exports = {
    cadPag,
    getTotal,
    total
}