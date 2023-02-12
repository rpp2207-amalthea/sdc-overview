const { Pool } = require('pg');

// const pool = new Pool({
//     "host": '127.0.0.1',
//     "user": 'tivo',
//     "database": 'sdc',
//     "password": '',
//     "port": 5432,
//     "max": 20,
//     "connectionTimeoutMillis": 0,
//     "idleTimeoutMillis": 0
// });

const pool = new Pool({
  "host": 'ec2-35-85-52-244.us-west-2.compute.amazonaws.com',
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
  deleteCart: async (query, callback) => {
    let session_id = query;
    let deleteQuery = {
      text: `DELETE FROM cart WHERE user_session = $1`,
      values: [session_id]
    }
    await pool.query(deleteQuery)
      .then(result => {
        callback(null, result);
      })
      .catch(err => {
        callback(err.stack, null);
      })
  }
}