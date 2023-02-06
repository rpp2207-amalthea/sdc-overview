CREATE TABLE IF NOT EXISTS products (
  id INT,
  name VARCHAR(50),
  slogan VARCHAR(100),
  description VARCHAR(500),
  category VARCHAR(50),
  default_price VARCHAR(10),
  PRIMARY KEY (id)
  );

CREATE TABLE IF NOT EXISTS features (
  id INT,
  product_id INT,
  feature VARCHAR(50),
  value VARCHAR(50),
  PRIMARY KEY(id),
  FOREIGN KEY (product_id)
    REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS styles (
  id INT,
  product_id INT,
  name VARCHAR(50),
  sale_price VARCHAR(10),
  original_price VARCHAR(10),
  default_style BOOLEAN,
  PRIMARY KEY (id),
  FOREIGN KEY (product_id)
    REFERENCES products(id)
);


CREATE TABLE IF NOT EXISTS photos (
  id INT,
  style_id INT,
  url TEXT,
  thumbnail_url TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (style_id)
    REFERENCES styles(id)
);

CREATE TABLE IF NOT EXISTS skus (
  id INT,
  style_id INT,
  size VARCHAR(10),
  quantity INT,
  PRIMARY KEY (id),
  FOREIGN KEY (style_id)
    REFERENCES styles(id)
);

CREATE TABLE IF NOT EXISTS related (
  id INT,
  current_product_id INT,
  related_product_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS cart (
id SERIAL PRIMARY KEY,
user_session TEXT,
sku_id INT,
active BOOLEAN
);

CREATE TABLE IF NOT EXISTS testCart (
id SERIAL PRIMARY KEY,
user_session TEXT,
sku_id INT,
active BOOLEAN
);