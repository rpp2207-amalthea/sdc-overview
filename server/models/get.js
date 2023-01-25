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
    },

    getStyles: async function (query, callback) {
        let product_id = Number(query);
        let stylesObj = {
            product_id: product_id,
        }
        let styles = {
            text: `
            SELECT json_build_object(
                'product_id', (SELECT id FROM products WHERE products.id = $1),
                'results', (
                    SELECT json_agg (
                        json_build_object(
                        'style_id', id,
                        'name', name,
                        'original_price', original_price,
                        'sale_price', sale_price,
                        'default_style', default_style,
                        'photos', (
                            SELECT json_agg(
                                json_build_object(
                                    'thumbnail_url', thumbnail_url,
                                    'url', url
                                )
                            ) FROM photos WHERE photos.style_id = styles.id
                        ),
                        'skus', (
                            SELECT json_object_agg (
                                skus.id, (
                                    SELECT json_build_object(
                                        'quantity', quantity,
                                        'size', size
                                    )
                                )
                            ) FROM skus WHERE skus.style_id = styles.id)
                        )
                    ) FROM styles WHERE styles.product_id = $1
                )
            ) as styles;`,

        values: [product_id]
        }

        await pool.query(styles)
        .then((results) => {
            stylesObj = results.rows[0].styles;
        })
        .then(() => {
            stylesObj.results.forEach((style) => {
                if (style.sale_price === 'null') {
                    style.sale_price = null;
                }
            })
        })
        .then(() => {
            callback(null, stylesObj);
        })
        .catch((err) => {
            callback(err.stack, null);
        });

    },

    getRelated: async function (query, callback) {
        let current_product_id = Number(query);
        // console.log('got query in Related Models: ', current_product_id);
        let queryRelated = {
            text: `
            SELECT related_product_id AS related_id FROM related WHERE current_product_id = $1;
            `,
            values: [current_product_id]
        }
        pool.query(queryRelated)
        .then(result => {
            // console.log('got related product id: ', result.rows[0]);
            let related_product_id = [result.rows[0].related_id];
            callback(null, related_product_id)
        })
        .catch(err => {
            callback(err.stack, null);
        });
    }

}




