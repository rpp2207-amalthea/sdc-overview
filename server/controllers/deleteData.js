const axios = require('axios');
const cookieParser = require('cookie-parser');
const model = require('../models/delete.js');

exports.deleteCart = (req, res) => {
  // console.log("🚀 ~ file: deleteData.js:6 ~ exports.deleteCart ~ req", req)
  let session_id = req.query.session_id;

  //testing variable
  // let session_id = req.body.id;

  model.deleteCart(session_id, (err, succ) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // console.log('deleted cart!', succ);
      res.status(204).send(succ);
    }
  })

}

