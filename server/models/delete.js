const db = require('../../db/index.js');
require('dotenv').config();

module.exports = {
  deleteCart: async (query, callback) => {
    let session_id = query;
    let deleteQuery = {
      text: `DELETE FROM cart WHERE user_session = $1`,
      values: [session_id]
    }
    await db.query(deleteQuery)
      .then(result => {
        callback(null, result);
      })
      .catch(err => {
        callback(err, null);
      })
  }
}