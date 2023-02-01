import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  vus: 1000,
  duration: '60s'
};

export default () => {
  http.get('http://localhost:8080/ipCurrent?product_id=100')
  sleep(1);
};
