const { Pool } = require('pg');
require('dotenv').config();

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
  "host": process.env.DB_HOST,
  "user": process.env.DB_USERNAME,
  "database": process.env.DB_DATABASE,
  "password": process.env.DB_PASSWORD,
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