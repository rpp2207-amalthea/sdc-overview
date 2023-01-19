const axios = require('axios')
const models = require('../models/get.js');

exports.redirectFromHome = (req, res) => {

  res.redirect('/ip/71704')

}


exports.getCurrentProductCardControl = (req, res) => {

  var incomingParamProductId = req.query.id;
  // var incomingParamProductId = req.params.id;
  // console.log("🚀 ~ file: initGetData.js:7 ~ incomingParamProductId", incomingParamProductId)

  models.getProduct(incomingParamProductId, (err, succ) => {
    if (err) {
      res.status(500).send(false);
    } else {
      console.log('got data from db to server', succ);
      res.status(200).send(succ);
    }
  })

  // const options = {
  //   method: 'GET',
  //   url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/${incomingParamProductId}`,
  //   headers: { Authorization: process.env.AUTH_SECRET },
  // };

  // axios(options)
  //   .then((result) => {
  //     // console.log('this is the productCardControl data: ', result.data);
  //     res.status(200).send(result.data)
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(500).send(err)
  //   })
}

exports.getRelatedProductCardControl = (req, res) => {

  var incomingParamProductId = req.query.id;

  const options = {
    method: 'GET',
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/${incomingParamProductId}`,
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

exports.getProductStylesControl = (req, res) => {

  var incomingParamProductId = req.query.id;

  const options = {
    method: 'GET',
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/${incomingParamProductId}/styles`,
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

exports.getProductRelatedControl = (req, res) => {

  var incomingParamProductId = req.query.id;

  const options = {
    method: 'GET',
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/${incomingParamProductId}/related`,
    headers: { Authorization: process.env.AUTH_SECRET },
  };
  axios(options)
    .then((result) => {
      // Logic code controller need to import function
      res.status(200).send(result.data)
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err)
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

  const options = {
    method: 'GET',
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/cart`,
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