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

    // stylesMeta: async (productID) => {
    //     try {
    //             let queryPhotoSkus = {
    //                 text: `SELECT json_build_object(
    //                     'style_id', id,
    //                     'name', name,
    //                     'original_price', original_price,
    //                     'sale_price', sale_price,
    //                     'default_style', default_style,
    //                     'photos', (
    //                         SELECT json_agg(
    //                             json_build_object(
    //                                 'thumbnail_url', thumbnail_url,
    //                                 'url', url
    //                             )
    //                         ) FROM photos WHERE photos.style_id = styles.id
    //                     ),
    //                     'skus', (
    //                         SELECT json_object_agg (
    //                             skus.id, (
    //                                 SELECT json_build_object(
    //                                     'quantity', quantity,
    //                                     'size', size
    //                                 )
    //                             )
    //                         ) FROM skus WHERE skus.style_id = styles.id)
    //                 ) FROM styles WHERE styles.product_id = $1;`,
    //                 values: [productID]
    //             }
    //             pool.query(queryPhotoSkus)
    //             .then((photoSkus) => {
    //                 console.log('got query: ', photoSkus.rows)
    //                 return photoSkus.rows;
    //             })
    //     } catch (err) {
    //         console.log(err);
    //     }
    // },


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
            callback(null, stylesObj);
        })
        .catch((err) => {
            callback(err.stack, null);
        });

    }

}




