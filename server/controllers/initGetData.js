const axios = require('axios')
const models = require('../models/get.js');
const modelPost = require('../models/post.js');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

exports.redirectFromHome = (req, res) => {

  res.redirect('/ip/71704')

}


exports.getCurrentProductCardControl = (req, res) => {

  var incomingParamProductId = req.query.id;

  //testing variable
  // var incomingParamProductId = req.body.id;

  // var incomingParamProductId = req.params.id;
  // console.log("🚀 ~ file: initGetData.js:7 ~ incomingParamProductId", incomingParamProductId)

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

  var incomingParamProductId = req.query.id;

  models.getProduct(incomingParamProductId, (err, succ) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(succ);
    }
  })

}

exports.getProductStylesControl = async (req, res) => {

  var incomingParamProductId = req.query.id;

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

  var incomingParamProductId = req.query.id;

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

exports.getProductReviewsControl = (req, res) => {

  var incomingParamProductId = req.query.id;

  const options = {
    method: 'GET',
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/reviews?product_id=${incomingParamProductId}`,
    headers: { Authorization: process.env.AUTH_SECRET },
  };
  axios(options)
    .then((result) => {
      res.status(200).send(result.data)
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err)
    })
};

exports.getProductReviewMeta = (req, res) => {
  var incomingParamProductId = req.query.id;
  const options = {
    method: 'GET',
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/reviews/meta?product_id=${incomingParamProductId}`,
    // params: { product_id: incomingParamProductId },
    headers: { Authorization: process.env.AUTH_SECRET }
  };
  axios(options)
    .then((result) => {
      res.status(200).send(result.data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};


exports.getProductQnAControl = (req, res) => {

  var incomingParamProductId = req.query.id;

  const options = {
    method: 'GET',
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/qa/questions?product_id=${incomingParamProductId}`,
    headers: { Authorization: process.env.AUTH_SECRET },
  };
  axios(options)
  .then((result) => {
    res.status(200).send(result.data)
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send(err)
  })
}
exports.getCart = (req, res) => {

  if (!req.cookies["session_id"]) {
    const session_id = uuidv4();
    // console.log('what is session id: ', session_id);
    modelPost.postSessionID(session_id, (err, succ) => {
      if(err) {
        res.status(500).send(err);
      } else {
        res.cookie('session_id',session_id).send();
      }
    })
  } else {
    const existing_session_id = req.cookies.session_id;
    models.getCart(existing_session_id, (err, succ) => {
      if(err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(succ);
      }
    })
  }


  // const options = {
  //   method: 'GET',
  //   url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/cart`,
  //   headers: { Authorization: process.env.AUTH_SECRET },
  // };
  // axios(options)
  // .then((result) => {
  //   res.status(200).send(result.query)
  // })
  // .catch((err) => {
  //   console.log(err);
  //   res.status(500).send(err)
  // })
}