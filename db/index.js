const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  user: 'tivo',
  database: 'sdc',
  password: '',
  port: 5432,
});

const execute = async (query) => {
  try {
    await client.connect();
    await client.query(query);
    return true;
  } catch (error) {
    console.error(error.stack);
    return false;
  } finally {
    await client.end();
  }
}

const text = `
    CREATE TABLE IF NOT EXISTS product (
      product_id INTEGER,
      campus VARCHAR(10),
      name VARCHAR(50),
      slogan VARCHAR(100),
      description VARCHAR(500),
      category VARCHAR(50),
      default_price VARCHAR(10),
      created_at TIMESTAMP,
      updated_at TIMESTAMP
    );`;

execute(text).then(result => {
  if (result) {
    console.log('Table created');
  }

});