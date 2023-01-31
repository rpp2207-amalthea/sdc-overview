const axios = require('axios')
const models = require('../models/get.js');
const modelPost = require('../models/post.js');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

exports.redirectFromHome = (req, res) => {

  res.redirect('/ip/71700')

}


exports.getCurrentProductCardControl = (req, res) => {

  var incomingParamProductId = req.query.product_id;


  //testing variable
  // var incomingParamProductId = req.body.id;

  models.getProduct(incomingParamProductId, (err, succ) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // console.log('current product: ', succ);
      res.status(200).send(succ);
    }
  })

}

exports.getRelatedProductCardControl = (req, res) => {

  var incomingParamProductId = req.query.product_id;
  // console.log("🚀 ~ file: initGetData.js:38 ~ incomingParamProductId", incomingParamProductId)

  models.getProduct(incomingParamProductId, (err, succ) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(succ);
    }
  })

}

exports.getProductStylesControl = async (req, res) => {

  var incomingParamProductId = req.query.product_id;

  //testing variable
  // var incomingParamProductId = req.body.id;


  models.getStyles(incomingParamProductId, (err, succ) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // console.log('styles: ', succ);
      res.status(200).send(succ);
    }
  })

}

exports.getProductRelatedControl = (req, res) => {

  var incomingParamProductId = req.query.product_id;

  //testing variable
  // var incomingParamProductId = req.body.id;

    models.getRelated(incomingParamProductId, (err, succ) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // console.log('got related products: ', succ);
      res.status(200).send(succ);
    }
  })

};


exports.getCart = (req, res) => {
// console.log("🚀 ~ file: initGetData.js:147 ~ req", req.query.session_id)

  if (!req.query.session_id) {
    const session_id = uuidv4();

    modelPost.postSessionID(session_id, (err, succ) => {
      if(err) {
        res.status(500).send(err);
      } else {
        console.log('successful session created created')
        res.cookie('session_id', session_id);
        console.log('cookie is set')
        res.send();
      }
    })
  } else {
    const existing_session_id = req.query.session_id;

    models.getCart(existing_session_id, (err, succ) => {
      if(err) {
        res.status(500).send(err);
      } else {
        let cart = JSON.stringify(succ);
        res.status(200).send(JSON.stringify(cart));
      }
    })
  }

}