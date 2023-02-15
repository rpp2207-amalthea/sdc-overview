const db = require('../../db/index.js');
require('dotenv').config();

module.exports = {

    getProduct: async (query, callback) => {
        // console.log('this is the query: ', query);
        let product_id = Number(query);
        let productObj;
        let queryProduct = {
            text: `SELECT json_build_object(
                'id', id,
                'name', name,
                'slogan', slogan,
                'description', description,
                'category', category,
                'default_price', default_price,
                'features', (
                    SELECT json_agg(
                        json_build_object(
                            'feature', feature,
                            'value', value
                        )
                    ) FROM features WHERE features.product_id = $1
                )
            ) FROM products WHERE products.id = $1;`,
            values: [product_id]
        }
        await db.query(queryProduct)
            .then(result => {
                productObj = result.rows[0].json_build_object;
                productObj.features.forEach(feature => {
                    if (feature.value === 'null') {
                        feature.value = null;
                    }
                })
                callback(null, productObj);
            })
            .catch(err => {
                callback(err.stack, null);
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

        await db.query(styles)
        .then((results) => {
            stylesObj = results.rows[0].styles;
        })
        .then(() => {
            // console.log("🚀 ~ file: get.js:103 ~ .then ~ stylesObj", stylesObj)
            if (stylesObj.results) {
                stylesObj.results.forEach((style) => {
                    if (style.sale_price === 'null') {
                        style.sale_price = null;
                    }
                })
            }
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
        db.query(queryRelated)
        .then(result => {
            // console.log('got related product id: ', result.rows[0]);
            let related_product_id = [result.rows[0].related_id];
            callback(null, related_product_id)
        })
        .catch(err => {
            callback(err.stack, null);
        });
    },

    getCart: async function(query, callback) {
    // console.log("🚀 ~ file: get.js:140 ~ getCart:function ~ query", query)

        let existing_session_id = query;
        let queryCart = {
            text: `SELECT sku_id FROM cart WHERE user_session = $1;`,
            values: [existing_session_id]
        }

        await db.query(queryCart)
            .then(result => {
                let itemCount = result.rows;
                callback(null, itemCount);
            })
            .catch(err => {
                callback(err.stack, null);
            })

    }

}




