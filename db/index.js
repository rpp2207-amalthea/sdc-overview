const { Pool } = require('pg');

const pool = new Pool({
  "host": process.env.DB_HOST,
  "user": process.env.DB_USERNAME,
  "database": process.env.DB_DATABASE,
  "password": process.env.DB_PASSWORD,
  "port": 5432,
  "connectionTimeoutMillis": 5000,
  "idleTimeoutMillis": 30000

//  "user": 'tivo',
//  "database": 'sdc',
//  "password": '',
//  "port": 5432
});


module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}


const products = `
  CREATE TABLE IF NOT EXISTS products (
    id INT,
    name VARCHAR(50),
    slogan VARCHAR(100),
    description VARCHAR(500),
    category VARCHAR(50),
    default_price VARCHAR(10),
    PRIMARY KEY (id)
    );`;

const features = `
  CREATE TABLE IF NOT EXISTS features (
    id INT,
    product_id INT,
    feature VARCHAR(50),
    value VARCHAR(50),
    PRIMARY KEY(id),
    FOREIGN KEY (product_id)
      REFERENCES products(id)
  );`;

const styles = `
  CREATE TABLE IF NOT EXISTS styles (
    id INT,
    product_id INT,
    name VARCHAR(50),
    sale_price VARCHAR(10),
    original_price VARCHAR(10),
    "default_style" BOOLEAN,
    PRIMARY KEY (id),
    FOREIGN KEY (product_id)
      REFERENCES products(id)
  );`;

const photos = `
  CREATE TABLE IF NOT EXISTS photos (
    id INT,
    style_id INT,
    url TEXT,
    thumbnail_url TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (style_id)
      REFERENCES styles(id)
  );`;

const skus = `
  CREATE TABLE IF NOT EXISTS skus (
    id INT,
    style_id INT,
    size VARCHAR(10),
    quantity INT,
    PRIMARY KEY (id),
    FOREIGN KEY (style_id)
      REFERENCES styles(id)
  );`;

const related = `
  CREATE TABLE IF NOT EXISTS related (
    id INT,
    current_product_id INT,
    related_product_id INT,
    PRIMARY KEY (id)
  );`;

const cart =  `
  CREATE TABLE IF NOT EXISTS cart (
  id SERIAL PRIMARY KEY,
  user_session TEXT,
  sku_id INT,
  active BOOLEAN
  );`;

const testCart = `
CREATE TABLE IF NOT EXISTS testCart (
  id SERIAL PRIMARY KEY,
  user_session TEXT,
  sku_id INT,
  active BOOLEAN
  );`;


pool.query(products)
  .then(result => {
    if (result) {
      // console.log('Products table created');
    }
    pool.query(features);
  })
  .then(result => {
    if (result) {
      // console.log('Features table created');
    }
    pool.query(styles);
  })
  .then(result => {
    if (result) {
      // console.log('Styles table created');
    }
    pool.query(photos);
  })
  .then(result => {
    if (result) {
      // console.log('Photos table created');
    }
    pool.query(skus);
  })
  .then(result => {
    if (result) {
      // console.log('SKUS table created');
    }
    pool.query(related);
  })
  .then(result => {
    if (result) {
      // console.log('Related table created');
    }
    pool.query(cart);
  })
  .then(result => {
    if(result) {
      // console.log('Cart table created');
    }
    pool.query(testCart);
    // client.end();
  })
  .then(result => {
    if(result) {
      // console.log('Test Cart Table created')
      console.log('Tables Created');
    }
    // pool.end();
  })

  // module.exports = { client, execute };
