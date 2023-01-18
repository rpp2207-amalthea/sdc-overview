const client = require('../../db/index.js');
const { Pool } = require('pg');

const pool = new Pool({
    "host": '127.0.0.1',
    "user": 'tivo',
    "database": 'sdc',
    "password": '',
    "port": 5432,
    "max": 20,
    "connectionTimeoutMillis": 0,
    "idleTimeoutMillis": 0
});
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
});

module.exports = {

    getProduct: async (query, callback) => {
        // console.log('this is the query: ', query);
        let product_id = Number(query);
        console.log('this is the query: ', product_id);
        // let queryProductID = `
        // SELECT * FROM products
        // JOIN features ON products.id = features.product_id
        // WHERE products.id = ${product_id};`;
        let queryProductID = {
            text: 'SELECT * FROM products JOIN features ON products.id = features.product_id WHERE products.id = $1',
            values: [product_id]
        }

        await pool.connect().then((client) => {
            return client
            .query(queryProductID)
            .then(result => {
                console.log('success query: ', result.rows[0]);
                callback(null, result.rows[0]);
            })
            .catch(err => {
                client.release();
                callback(err.stack, null);
            });
        });
    }

}



