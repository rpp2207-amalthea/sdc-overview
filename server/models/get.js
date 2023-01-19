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
        let productObj;
        let queryProduct = {
            text: 'SELECT * FROM products WHERE products.id = $1',
            values: [product_id]
        }
        let queryFeatures = {
            text: 'SELECT feature, value FROM features WHERE features.product_id = $1',
            values: [product_id]
        }

        await pool.connect().then((client) => {
            return client
            .query(queryProduct)
            .then(result => {
                productObj = result.rows[0];
                productObj["features"] = [];
            })
            .then(async () => {
                const features = await pool.query(queryFeatures)
                features.rows.forEach(feature => {
                    if (feature.value !== 'null') {
                        productObj["features"].push(feature);
                    }
                })
                callback(null, productObj);

            })
            .catch(err => {
                client.release();
                callback(err.stack, null);
            });
        });

    }

}




