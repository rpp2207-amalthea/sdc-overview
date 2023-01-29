const axios = require('axios');
const cookieParser = require('cookie-parser');
const model = require('../models/delete.js');

exports.deleteCart = (req, res) => {
  let session_id = req.cookies.session_id;

  model.deleteCart(session_id, (err, succ) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // console.log('deleted cart!', succ);
      res.status(204).send(succ);
    }
  })

}

