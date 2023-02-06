const axios = require('axios');
const cloudinary = require('../cloudinary');
const uploader = require('../multer');
const cookieParser = require('cookie-parser');
const model = require('../models/post.js');


exports.postAddToCart = (req, res) => {
// console.log("🚀 ~ file: postData.js:112 ~ req", req.body)

  // let sku_id = req.body.cartData.sku_id;
  // let session_id = req.body.session_id;

  //testing variables
  let sku_id = req.body.sku_id;
  let session_id = req.body.session_id;

  let cart = {
    session_id: session_id,
    sku_id: sku_id
  }
  // console.log("🚀 ~ file: postData.js:22 ~ req", req.body)

  model.addToCart(cart, (err, succ) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // console.log('added to cart', succ);
      res.status(201).send(succ.rowCount);
    }
  })

}



