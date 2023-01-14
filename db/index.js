const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  user: 'tivo',
  database: 'sdc',
  password: '',
  port: 5432,
});

client.connect();

const execute = async (query) => {
  try {
    await client.query(query);
    return true;
  } catch (error) {
    console.error(error.stack);
    return false;
  }
  // finally {
  //   await client.end();
  // }
}

const products = `
  CREATE TABLE IF NOT EXISTS products (
    product_id INT,
    campus VARCHAR(10),
    name VARCHAR(50),
    slogan VARCHAR(100),
    description VARCHAR(500),
    category VARCHAR(50),
    default_price VARCHAR(10),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (product_id)
    );`;

const features = `
  CREATE TABLE IF NOT EXISTS features (
    id INT,
    feature VARCHAR(50),
    value VARCHAR(50),
    PRIMARY KEY(id)
  );`;

const styles = `
  CREATE TABLE IF NOT EXISTS styles (
    style_id INT,
    name VARCHAR(50),
    original_price VARCHAR(10),
    sale_price VARCHAR(10),
    "default?" BOOLEAN,
    PRIMARY KEY (style_id)
  );`;

const style_ref = `
  CREATE TABLE IF NOT EXISTS style_ref (
    product_id INT,
    style_id INT,
    FOREIGN KEY (product_id)
      REFERENCES products(product_id),
    FOREIGN KEY (style_id)
      REFERENCES styles(style_id)
  );`;

const feature_ref = `
  CREATE TABLE IF NOT EXISTS feature_ref (
    product_id INT,
    feature_id INT,
    FOREIGN KEY (product_id)
      REFERENCES products(product_id),
    FOREIGN KEY (feature_id)
      REFERENCES features(id)
  );`;

const photos = `
  CREATE TABLE IF NOT EXISTS photos (
    id INT,
    style_id INT,
    thumbnail_url VARCHAR(500),
    url VARCHAR(500),
    PRIMARY KEY (id),
    FOREIGN KEY (style_id)
      REFERENCES styles(style_id)
  );`;

const skus = `
  CREATE TABLE IF NOT EXISTS skus (
    sku_id INT,
    style_id INT,
    quantity INT,
    size VARCHAR(10),
    PRIMARY KEY (sku_id),
    FOREIGN KEY (style_id)
      REFERENCES styles(style_id)
  );`;


execute(products)
  .then(result => {
    if (result) {
      console.log('Products table created');
    }
    return execute(features);
  })
  .then(result => {
    if (result) {
      console.log('Features table created');
    }
    return execute(styles);
  })
  .then(result => {
    if (result) {
      console.log('Styles table created');
    }
    return execute(style_ref);
  })
  .then(result => {
    if (result) {
      console.log('Style Ref table created');
    }
    return execute(feature_ref);
  })
  .then(result => {
    if (result) {
      console.log('Feature Ref table created');
    }
    return execute(photos);
  })
  .then(result => {
    if (result) {
      console.log('Photos table created');
    }
    return execute(skus);
  })
  .then(result => {
    if (result) {
      console.log('SKUS table created');
    }
    client.end();
  });

  module.exports = client;