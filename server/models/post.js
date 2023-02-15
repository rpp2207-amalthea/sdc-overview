const db = require('../../db/index.js');
require('dotenv').config();

module.exports = {

  postSessionID: async (query, callback) => {
    let user_session = query;
    let insertSessionQuery = {
      text:`
      INSERT INTO cart(user_session)
      VALUES($1);`,
      values: [user_session]
    }

    await db.query(insertSessionQuery)
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

    await db.query(insertCartQuery)
      .then(result => {
        callback(null, result.rowCount);
      })
      .catch(err => {
        callback(err.stack, null);
      })
  }

}