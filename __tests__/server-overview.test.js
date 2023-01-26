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

  before('Create Temporary Tables', async function () {
    const product_data = {
      id: 71697,
      name: 'Camo Onesie',
      slogan: 'Blend in to your crowd',
      description: 'The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.',
      category: 'Jackets',
      default_price: '140.00'
    };
    const features = [
      {
        feature: 'Fabric',
        value: 'Canvas'
      },
      {
        feature: 'Buttons',
        value: 'Brass'
      }
    ];
    const styles = {
      id: 1,
      product_id: 71697,
      name: "Forest Green & Black",
      original_price: "140.00",
      sale_price: 'null',
      default: true
    }

    await client.query(`CREATE TEMPORARY TABLE products (LIKE products INCLUDING ALL)`);
    await client.query(`CREATE TEMPORARY TABLE features (LIKE features INCLUDING ALL)`);
    await client.query(`CREATE TEMPORARY TABLE styles (LIKE styles INCLUDING ALL)`);

    await client.query(`INSERT INTO products(id, name, slogan, description, category, default_price)
                        VALUES ($1, $2, $3, $4, $5, $6)`, [product_data.id, product_data.name, product_data.slogan, product_data.description, product_data.category, product_data.default_price]);
    await client.query(`INSERT INTO features(id, product_id, feature, value)
                        VALUES
                          ($1, $2, $3, $4),
                          ($5, $6, $7, $8)`, [1, product_data.id, features[0].feature, features[0].value, 2, product_data.id, features[1].feature, features[1].value]);
    await client.query(`INSERT INTO styles(id, product_id, name, original_price, sale_price, default_style)
                        VALUES ($1, $2, $3, $4, $5, $6)`, [styles.id, styles.product_id, styles.name, styles.original_price, styles.sale_price, styles.default]);

  })

  afterEach('Drop Temporary Tables', async function () {
    await client.query('DROP TABLE IF EXISTS pg_temp.products');
  })

  describe('PRODUCT DETAILS Integration Tests', function () {
    it('GET Request for PRODUCT should return a correct data structure', async function () {
      const product_id = 71697;
      const { rows } = await client.query(`SELECT * FROM products WHERE id = $1`, [product_id]);

      expect(rows[0].id).to.deep.equal(product_id);
      expect(rows[0].name).to.deep.equal('Camo Onesie');
      expect(rows[0].slogan).to.deep.equal('Blend in to your crowd');
      expect(rows[0].description).to.deep.equal('The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.');
      expect(rows[0].category).to.deep.equal('Jackets');
      expect(rows[0].default_price).to.deep.equal('140.00');
    })

    //need to write failing test for product
    it('GET Request for PRODUCT FEATURES should return a correct data structure', async function () {
      const product_id = 71697;
      const { rows } = await client.query(`SELECT feature, value FROM features WHERE product_id = $1`, [product_id]);

      expect(rows[0].feature).to.deep.equal('Fabric');
      expect(rows[0].value).to.deep.equal('Canvas');
      expect(rows[1].feature).to.deep.equal('Buttons');
      expect(rows[1].value).to.deep.equal('Brass');
    })
    //need to write failing test for feature
  })

  describe('PRODUCT STYLES Integration Test', function () {
    it('GET Request for PRODUCT STYLES should return a correct data structure', async function () {
      const product_id = 71697;
      const { rows } = await client.query(`SELECT * FROM styles WHERE product_id = $1`, [product_id]);

      expect(rows[0].id).to.deep.equal(1);
      expect(rows[0].product_id).to.deep.equal(71697);
      expect(rows[0].name).to.deep.equal('Forest Green & Black');
      expect(rows[0].original_price).to.deep.equal('140.00');
      expect(rows[0].sale_price).to.deep.equal('null');
      expect(rows[0].default_style).to.deep.equal(true);
    })
  })

  //write test for photos

  //write test for skus

  //write test for related

  //write test for routers

  //write test for models

  //write test for controllers

})
