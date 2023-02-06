import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  vus: 1000,
  duration: '60s'
};

export default () => {
  let cart = {
    session_id: 12345,
    sku_id: 790
}

  http.post('http://localhost:8080/addToCart', cart)
  sleep(1);
};