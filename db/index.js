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

const style_ref = `
  CREATE TABLE IF NOT EXISTS style_ref (
    product_id INT,
    style_id INT,
    FOREIGN KEY (product_id)
      REFERENCES products(id),
    FOREIGN KEY (style_id)
      REFERENCES styles(id),
    PRIMARY KEY (product_id, style_id)
  );`;

const feature_ref = `
  CREATE TABLE IF NOT EXISTS feature_ref (
    product_id INT,
    feature_id INT,
    FOREIGN KEY (product_id)
      REFERENCES products(id),
    FOREIGN KEY (feature_id)
      REFERENCES features(id),
    PRIMARY KEY (product_id, feature_id)
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

  module.exports = { client, execute };
  // module.exports = execute;