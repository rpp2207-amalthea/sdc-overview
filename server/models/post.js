const { Pool } = require('pg');

// const pool = new Pool({
//     "host": '127.0.0.1',
//     "user": 'tivo',
//     "database": 'sdc',
//     "password": '',
//     "port": 5432,
//     "max": 1000,
//     "connectionTimeoutMillis": 10000,
//     "idleTimeoutMillis": 10000
// });

const pool = new Pool({
  "host": '52.13.1.87',
  "user": 'tivothis',
  "database": 'product_overview',
  "password": 'password',
  "port": 5432,
  "max": 1000,
  "connectionTimeoutMillis": 10000,
  "idleTimeoutMillis": 10000
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
});

module.exports = {

  postSessionID: async (query, callback) => {
    let user_session = query;
    let insertSessionQuery = {
      text:`
      INSERT INTO cart(user_session)
      VALUES($1);`,
      values: [user_session]
    }

    await pool.query(insertSessionQuery)
      .then((results) => {
        // console.log('session insert result: ', results);
        callback(null, results);
      })
      .catch(err => {
        callback(err.stack, null);
      })

  },

  addToCart: async (query, callback) => {
    // console.log('got add to cart query: ', query);
    let cart = query;
    let insertCartQuery = {
      text: `INSERT INTO cart(user_session, sku_id) VALUES($1, $2);`,
      values: [cart.session_id, Number(cart.sku_id)]
    }

    await pool.query(insertCartQuery)
      .then(result => {
        callback(null, result.rowCount);
      })
      .catch(err => {
        callback(err.stack, null);
      })
  }

}