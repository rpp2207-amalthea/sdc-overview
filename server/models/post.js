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

  postSessionID: async (query, callback) => {
    let user_session = query;
    console.log('got session query: ', user_session);

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

  }
}