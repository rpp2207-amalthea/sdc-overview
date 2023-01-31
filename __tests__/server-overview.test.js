const { expect } = require('chai');
const request = require('supertest');
const Pool = require('pg-pool');
const client = require('../db/index.js')
const initGetData = require('../server/controllers/initGetData.js');
const models = require('../server/models/get.js');
const app = require('../server/index.js');

describe('PRODUCT OVERVIEW ROUTE', function () {



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


  })

  beforeEach('Create Temporary Tables', async function () {
    await client.query(`CREATE TEMPORARY TABLE products (LIKE products INCLUDING ALL)`);
    await client.query(`CREATE TEMPORARY TABLE features (LIKE features INCLUDING ALL)`);
    await client.query(`CREATE TEMPORARY TABLE styles (LIKE styles INCLUDING ALL)`);
    await client.query(`CREATE TEMPORARY TABLE photos (LIKE photos INCLUDING ALL)`);
    await client.query(`CREATE TEMPORARY TABLE skus (LIKE skus INCLUDING ALL)`);
    await client.query(`CREATE TEMPORARY TABLE related (LIKE related INCLUDING ALL)`);
    await client.query(`CREATE TEMPORARY TABLE cart (LIKE cart INCLUDING ALL)`);
  })

  beforeEach('Insert sample data before each test', async function () {

    const product_data = {
      id: 71697,
      name: 'Test Product',
      slogan: 'The best product around',
      description: 'The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.',
      category: 'Jackets',
      default_price: '140.00'
    };
    const features = [
      {
        feature: 'Fabric',
        value: 'Jeans'
      },
      {
        feature: 'Buttons',
        value: 'Wooden'
      }
    ];
    const styles = {
      id: 1,
      product_id: 71697,
      name: "Forest Green & Black",
      original_price: "140.00",
      sale_price: 'null',
      default: true
    };
    const photos =  {
          style_id: 1,
          thumbnail_url: "https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80",
          url: "https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
      };

    const skus = {
      style_id: 1,
      quantity: 8,
      size: 'XS'
    }
    const related = {
      id: 1,
      current_product_id: 71697,
      related_product_id: 3000
    }
    const cart = {
      id: 1,
      session_id: '12345',
      sku_id: 1234
    }


    await client.query(`INSERT INTO pg_temp.products(id, name, slogan, description, category, default_price)
                        VALUES ($1, $2, $3, $4, $5, $6)`, [product_data.id, product_data.name, product_data.slogan, product_data.description, product_data.category, product_data.default_price]);
    await client.query(`INSERT INTO pg_temp.features(id, product_id, feature, value)
                        VALUES
                          ($1, $2, $3, $4),
                          ($5, $6, $7, $8)`, [1, product_data.id, features[0].feature, features[0].value, 2, product_data.id, features[1].feature, features[1].value]);
    await client.query(`INSERT INTO pg_temp.styles(id, product_id, name, original_price, sale_price, default_style)
                        VALUES ($1, $2, $3, $4, $5, $6)`, [styles.id, styles.product_id, styles.name, styles.original_price, styles.sale_price, styles.default]);
    await client.query(`INSERT INTO pg_temp.photos(id, style_id, url, thumbnail_url)
                        VALUES ($1, $2, $3, $4)`, [1, photos.style_id, photos.url, photos.thumbnail_url]);
    await client.query(`INSERT INTO pg_temp.skus(id, style_id, size, quantity)
                        VALUES ($1, $2, $3, $4)`, [1, skus.style_id, skus.size, skus.quantity]);
    await client.query(`INSERT INTO pg_temp.related(id, current_product_id, related_product_id)
                        VALUES ($1, $2, $3)`, [related.id, related.current_product_id, related.related_product_id]);
    await client.query(`INSERT INTO pg_temp.cart(id, user_session, sku_id)
                        VALUES ($1, $2, $3)`, [cart.id, cart.session_id, cart.sku_id]);

  })



  afterEach('Drop Temporary Tables', async function () {
    await client.query('DROP TABLE IF EXISTS pg_temp.products');
    await client.query('DROP TABLE IF EXISTS pg_temp.features');
    await client.query('DROP TABLE IF EXISTS pg_temp.styles');
    await client.query('DROP TABLE IF EXISTS pg_temp.photos');
    await client.query('DROP TABLE IF EXISTS pg_temp.skus');
    await client.query('DROP TABLE IF EXISTS pg_temp.related');
    await client.query('DROP TABLE IF EXISTS pg_temp.cart');
  })

  describe('PRODUCT DETAILS Integration Tests', function () {
    it('Querying PRODUCT should return correct Product Values from DB', async function () {
      const product_id = 71697;
      const { rows } = await client.query(`SELECT * FROM products WHERE id = $1`, [product_id]);

      expect(rows[0].id).to.deep.equal(product_id);
      expect(rows[0].name).to.deep.equal('Test Product');
      expect(rows[0].slogan).to.deep.equal('The best product around');
      expect(rows[0].description).to.deep.equal('The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.');
      expect(rows[0].category).to.deep.equal('Jackets');
      expect(rows[0].default_price).to.deep.equal('140.00');
    })

    //need to write failing test for product

    it('Querying PRODUCT FEATURES should return correct values from DB', async function () {
      const product_id = 71697;
      const { rows } = await client.query(`SELECT feature, value FROM features WHERE product_id = $1`, [product_id]);

      expect(rows[0].feature).to.deep.equal('Fabric');
      expect(rows[0].value).to.deep.equal('Jeans');
      expect(rows[1].feature).to.deep.equal('Buttons');
      expect(rows[1].value).to.deep.equal('Wooden');
    })
    //need to write failing test for feature


  })

  describe('PRODUCT STYLES Integration Test', function () {
    it('Querying PRODUCT STYLES should return correct values from DB', async function () {
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

  describe('STYLE PHOTOS Integration Test', function () {
    it('Querying STYLE PHOTOS should return correct values from DB', async function () {
      const style_id = 1;
      const photos =  {
        style_id: 1,
        thumbnail_url: "https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80",
        url: "https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
    };
      const { rows } = await client.query(`SELECT * FROM photos WHERE style_id = $1`, [style_id])

      expect(rows[0].style_id).to.equal(photos.style_id);
      expect(rows[0].thumbnail_url).to.equal(photos.thumbnail_url);
      expect(rows[0].url).to.equal(photos.url);
    })
  })

  describe('SKUS Integration Test', function () {
    it('Querying STYLE SKUS should return correct values from DB', async function () {
      const style_id = 1;
      const skus = {
        style_id: 1,
        quantity: 8,
        size: 'XS'
      }
      const { rows } = await client.query(`SELECT * FROM skus WHERE style_id = $1`, [style_id])

      expect(rows[0].style_id).to.equal(skus.style_id);
      expect(rows[0].size).to.equal(skus.size);
      expect(rows[0].quantity).to.equal(skus.quantity);
    })
  })

  describe('RELATED PRODUCT Integration Test', function () {
    it('Querying RELATED PRODUCT should return correct values from DB', async function () {
      const current_product_id = 71697;
      const related = {
        id: 1,
        current_product_id: 71697,
        related_product_id: 3000
      }
      const { rows } = await client.query(`SELECT related_product_id FROM related WHERE current_product_id = $1`, [current_product_id])

      expect(rows[0].related_product_id).to.equal(related.related_product_id);
    })
  })

  describe('CART Integration Test', function () {
    it('Querying CART should return correct values from DB', async function () {
      const cart = {
        id: 2,
        session_id: '12345',
        sku_id: 1234
      }
      // await client.query(`CREATE TEMPORARY TABLE cart (LIKE cart INCLUDING ALL)`);
      // await client.query(`INSERT INTO pg_temp.cart(id, user_session, sku_id)
      // VALUES ($1, $2, $3)`, [cart.id, cart.session_id, cart.sku_id]);

      const { rows } = await client.query(`SELECT sku_id FROM cart WHERE user_session = $1`, [cart.session_id])
      await deleteCart(cart.session_id)
      expect(rows[0].sku_id).to.deep.equal(cart.sku_id);
    })

  })

  // //write test for routers
  describe('REDIRECT Router Test', function () {
    it('returns status 302 when requesting "/" route', async function () {
      await redirect()
    })

  })

  describe('CURRENT PRODUCT Router Test', function () {
    it('returns status 200 with valid product id', async function() {
      const req = {id:  '71697'};

      await getProduct(req)
    })

    it('returns status 500 with invalid product id', async function () {
      const req = {id: 'BAD ID'}

      await getProduct(req, 500);
    })
  })

  describe('GET STYLES Router Test', function () {
    it('returns status 200 with valid product id', async function () {
      const req = {id: '71697'};

      await getStyles(req)
    })

    it('returns status 500 with invalid product id', async function () {
      const req = {id: 'SUPER BAD!!!'};

      await getStyles(req, 500)
    })
  })


  describe('GET RELATED PRODUCT ID Router Test', function () {

    it('returns status 200 with valid product id', async function () {
      const req = {id: '71697'};

      await getRelated(req)
    })

    it('returns status 500 with invalid product id', async function () {
      const req = {id: 'SUPER INVALID!!!'};

      await getRelated(req, 500)
    })
  })

  describe('GET CART Router Test', function () {
    it('returns status 200', async function () {
      await getCart()
    })

  })

  describe('POST CART Router Test', function () {
    it('returns status 204', async function () {
      const req = {id: '71697'};
      await postCart(req)
    })

  })


  const redirect = async (status = 302) => {
    const { body } = await request(app)
      .get('/redirect')
      .expect(status)
    return body;
  }

  const getProduct = async (req, status = 200) => {
    const { body } = await request(app)
      .get('/getProductModelTest')
      .send(req)
      .expect(status)
    return body;
  }

  const getStyles = async (req, status = 200) => {
    const { body } = await request(app)
      .get('/getProductStyleTest')
      .send(req)
      .expect(status)
    return body;
  }

  const getRelated = async (req, status = 200) => {
    const { body } = await request(app)
      .get('/getRelatedProductIdTest')
      .send(req)
      .expect(status)
    return body;
  }

  const getCart = async (req, status = 200) => {
    const { body } = await request(app)
      .get('/getCartTest')
      .send(req)
      .expect(status)
    return body;
  }

  const postCart = async (req, status = 200) => {
    const { body } = await request(app)
      .get('/postCartTest')
      .send(req)
      .expect(status)
    return body;
  }

  const deleteCart = async (req, status = 204) => {
    const { body } = await request(app)
      .get('/deleteCartTest')
      .send(req)
      .expect(status)
    return body;
  }

})
