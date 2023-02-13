// EXPRESS SERVER Index

require('dotenv').config();
const express = require ("express");
const axios = require ('axios')
const app = express();
const cookieParser = require('cookie-parser');
const cors = require("cors");
const { uuid } = require('uuidv4');
const initGetData = require("./controllers/initGetData.js");
const postData = require('./controllers/postData.js');
// const putData = require('./controllers/putData.js');
//for image uploads
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });

const deleteData = require('./controllers/deleteData.js');
const compression = require('compression');

app.use(cookieParser());
app.use(express.json());
app.use(cors()); // Not sure if needed
app.use(compression())
app.use(express.urlencoded({ extended: false }));

app.use('/ip/:id', express.static(__dirname + '/../client/dist'));
let port = 3050;
// ROUTES

app.get('/loaderio-44c2dd1bd8cb4ebf5054e6834a73fa58', (req, res) => {
  fs.readFile('loaderio.txt', 'utf8', (err, data) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.status(200).send(data);
    }
  })
})
app.get('/', initGetData.redirectFromHome);

app.get('/ipCurrent', initGetData.getCurrentProductCardControl);

app.get('/ipRelated', initGetData.getRelatedProductCardControl);

app.get('/getProductStyles', initGetData.getProductStylesControl);

app.get('/getProductRelated', initGetData.getProductRelatedControl);

app.get('/getCart', initGetData.getCart);

app.post('/addToCart', postData.postAddToCart);

app.delete('/deleteCart', deleteData.deleteCart);


//INTEGRATION TESTING ROUTES
app.get('/redirect', initGetData.redirectFromHome)
app.get('/getProductModelTest', initGetData.getCurrentProductCardControl);
app.get('/getProductStyleTest', initGetData.getProductStylesControl);
app.get('/getRelatedProductIdTest', initGetData.getProductRelatedControl);
app.get('/getCartTest', initGetData.getCart);
app.post('/postCartTest', postData.postAddToCart);
app.delete('/deleteCartTest', deleteData.deleteCart);

module.exports = app.listen(port, () => console.log(`Our server is listening on port ${port}...`))