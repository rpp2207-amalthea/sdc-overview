const axios = require('axios');
// const Redis = require('redis');
// const redisClient = Redis.createClient() // for production, add {url: of production redis instance}
// redisClient.connect();
const models = require('../models/get.js');
const modelPost = require('../models/post.js');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
// const DEFAULT_EXPIRATION = 3600;


exports.redirectFromHome = (req, res) => {

  res.redirect('/ip/71706')

}



exports.getCurrentProductCardControl = async (req, res) => {

  var incomingParamProductId = req.query.product_id;
  // console.log("🚀 ~ file: initGetData.js:17 ~ incomingParamProductId", incomingParamProductId)
  // try {
  //   console.log('trying')
  //   await redisClient.get(`product_id=${incomingParamProductId}`, (error, product) => {
  //     console.log("invoking redis GET method")
  //     if (product) {
  //       console.log("Cache HIT");
  //       let cacheProduct = JSON.parse(product);
  //       res.status(200).send(cacheProduct);
  //     } else {
  //       console.log("Cache MISS");
  //       models.getProduct(incomingParamProductId, async (err, succ) => {
  //         if (err) {
  //           res.status(500).send(err);
  //         } else {
  //           console.log("got product from DB")
  //           await redisClient.setex(`product_id=${incomingParamProductId}`, DEFAULT_EXPIRATION, JSON.stringify(succ));
  //           res.status(200).send(succ);
  //         }
  //       })
  //     }
  //   })
  // } catch (err) {
  //   res.status(500).send(err);
  // }

  //testing variable
  // var incomingParamProductId = req.body.id;

  models.getProduct(incomingParamProductId, (err, succ) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // console.log('current product: ', succ);
      // redisClient.set(`product_id=${incomingParamProductId}`, DEFAULT_EXPIRATION, JSON.stringify(succ));
      // console.log('redis SET Cache')
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
// console.log("🚀 ~ file: initGetData.js:88 ~ req", req.query.session_id)

  if (!req.query.session_id) {
    const session_id = uuidv4();

    // console.log("🚀 ~ file: initGetData.js:92 ~ session_id", session_id)

    modelPost.postSessionID(session_id, (err, succ) => {
      if(err) {
        res.status(500).send(err);
      } else {
        // console.log('successful session created created')
        res.cookie('session_id', session_id);
        // console.log('cookie is set')
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

exports.getLoaderio = (req, res) => {
    fs.readFile('loaderio.txt', 'utf8', (err, data) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.status(200).send(data);
      }
    })
}