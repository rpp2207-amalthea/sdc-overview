const { expect } = require('chai');
const request = require('supertest');
const Pool = require('pg-pool');
const client = require('../db/index.js')

describe('Get Product Overview Route', function () {

  let app;

  before('Mock db connection and load app', async function () {
    const pool = new Pool({
      database: 'sdc',
      user: 'tivo',
      password: '',
      port: 5432,
      max: 1,
      idleTimeoutMillis: 0
    })

    client.query = (text, values) => {
      return pool.query(text, values);
    }

    app = require('../server/index.js');
  })

  beforeEach('Create Temporary Tables', async function () {
    const product_data = {
      id: 71697,
      name: 'Camo Onesie',
      slogan: 'Blend in to your crowd',
      description: 'The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.',
      category: 'Jackets',
      default_price: '140.00'
    }
    await client.query('CREATE TEMPORARY TABLE products (LIKE products INCLUDING ALL)');
    await client.query(`
      INSERT INTO products(id, name, slogan, description, category, default_price)
      VALUES ($1, $2, $3, $4, $5, $6)`, [product_data.id, product_data.name, product_data.slogan, product_data.description, product_data.category, product_data.default_price]);

  })

  afterEach('Drop Temporary Tables', async function () {
    await client.query('DROP TABLE IF EXISTS pg_temp.products');
  })

  describe('Get a product details for overview', function() {
    it('GET Request should return a product object with correct data structure', async function() {
      const product_id = 71697;
      const { rows } = await client.query(`SELECT * FROM products WHERE id = $1`, [product_id])

      expect(rows[0].id).to.deep.equal(product_id);
      expect(rows[0].name).to.deep.equal('Camo Onesie');
      expect(rows[0].slogan).to.deep.equal('Blend in to your crowd');
      expect(rows[0].description).to.deep.equal('The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.');
      expect(rows[0].category).to.deep.equal('Jackets');
      expect(rows[0].default_price).to.deep.equal('140.00');
    })

  })

})


