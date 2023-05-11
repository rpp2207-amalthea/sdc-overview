# Product Overview Microservice

## 💡 Overview
This was an inherited code base with the following instructions: "The current backend system for this e-commerce site cannot withstand the increased traffic it is receiving. Your project is to replace the existing API for Product Overview with a back end system that can support the full data set for the feature and can scale to meet the demands of production traffic". 

This was a monolithic repo and we were task with refactoring it to a microservice archtecture. Below is the documentation of this process throughout in addition to production optimizations. This repo focuses on the Product Overview services alone. K6 was use for stress testing locally and loader.io and New Relic were used for stress testing in production. Nginx was used for load balancing and caching. However the config file is not available in this repo because it was created and configured directly in the AWS instance. This diagram below represents the final architecture. 

![alt](https://res.cloudinary.com/djfpzruso/image/upload/c_scale,w_800/v1683841301/Screenshot_2023-04-11_at_4.30.29_PM_wwybuw.png)

## 🤖 Highlights
- Converted monolithic e-commerce repo to microservice-oriented architecture and deployed to AWS EC2 instances
- Transformed product overview widget to microservice, increased throughput by 733% - from 120 RPS in 78ms to 1000 RPS in 350ms
- Used Loader.io, K6, and New Relic to stress test the microservice, reducing latency from 560ms to 70ms
- Utilized NGINX to horizontally scale microservice, adding load balancing and caching for 400% throughput increase - 5000 RPS with 79ms latency
- Optimized PostgreSQL query execution times average from 2500ms to 0.14ms through JSON aggregation and table indexing
- Achieved 85% code coverage using Mocha, Chai and Supertest

# Initial Stress Testing
## Before Load Balancing and Caching
### GET Products - testing between product_id 800,000 - 1,000,011

**1000 RPS**

![alt](https://res.cloudinary.com/djfpzruso/image/upload/c_scale,w_800/v1683841417/1000_rps_mtlrn8.png)
Results: 0% error-rate, 997ms latency

### POST to Cart

**1000 RPS**

![alt](https://res.cloudinary.com/djfpzruso/image/upload/c_scale,w_800/v1683841483/1000_rps_post_pe3mlx.png)
Results: 0.0% error-rate, 559ms latency

## After Nginx Load Balancing and Caching
### GET Products - testing between product_id 800,000 - 1,000,011

**1000 RPS**

![alt](https://res.cloudinary.com/djfpzruso/image/upload/c_scale,w_800/v1683841564/1000_rps_get_after_yobyms.png)
Previous Results : 0.0% error-rate, 997ms latency
New Results: 0.5% error-rate, 121ms latency

### My Challenge
I noticed that my error rate went up because of 271 Timeout requests. Running stress tests at ****1000 RPS**** continued giving me an average of 300 timeout requests, affecting my error-rate. 

### My Action
After doing some research trying to figure out why my requests were timing out, I learned that Nginx allows you to configure Keep Alives, which keeps a TCP connection open for a certain number of requests to the server or until the timeout period has expired. Creating new TCP connections uses up resources, but keep alives reduces this usage by keeping the connection open.

I configured Nginx by setting  `keepalive` in my upstream backserver to `3000` (3 seconds)

```
upstream backendserver {
          least_conn;

          server 54.213.118.208;
          server 52.33.234.73;
          server 54.148.204.20;
          server 35.90.247.26;

          keepalive 3000;
        }
```

## My Result - keepalive configured
### GET Products - testing between product_id 800,000 - 1,000,011

**1000 RPS**

![alt](https://res.cloudinary.com/djfpzruso/image/upload/c_scale,w_800/v1683841634/1000_rps_keep_alives_dql7cf.png)
Before keep alives: 0.5% error-rate and 121ms latency
New Results: 0% error-rate and 89ms latency, 0 timeouts

### POST to Cart

**switching between 3 session_ids and skus**

**1000 RPS - after load balancer, caching and keep alives configured**

![alt](https://res.cloudinary.com/djfpzruso/image/upload/c_scale,w_800/v1683841707/1000_rps_post_cart_m1bfeq.png)
Previous Results: 0% error-rate, 559ms latency
New Results: 0% error rate, 67ms latency


After configuring my keep alives, I decided to push my RPS to the limit. I decided to test my GET Products route testing product_ids randomly between 800K to 1 million. 

**5000RPS**

![alt](https://res.cloudinary.com/djfpzruso/image/upload/c_scale,w_800/v1683841758/5000_rps_uxrtat.png)
Results: 0% error - rate, 79ms latency

I pushed up to 8000 RPS and reached a 4.1% error-rate, 126ms latency, and 19850 requests with a 500 Status Error. Adding a 5th API Instance did not show any improvement. 

![alt](https://res.cloudinary.com/djfpzruso/image/upload/c_scale,w_800/v1683841806/8000_rps_cy47al.png)
Checking my CPU usage of my Nginx Server showed that my CPU usage was pushed to 68%.

![alt](https://res.cloudinary.com/djfpzruso/image/upload/c_scale,w_800/v1683841987/cpu_screenshot1_fljf3x.png)
As an experiment, I decided to scale my Nginx vertically to see if I could push my stress testing

### T2 xlarge - 4 CPUs and 16 GB RAM

**8000 RPS**

![alt](https://res.cloudinary.com/djfpzruso/image/upload/c_scale,w_800/v1683841933/8000_rps_tc2large_w4unll.png)
Previous Result: 4.1% error-rate, 129ms latency, 19850 requests with 500 Status Error.
New Result: 0% error-rate, 110ms latency

**10000 RPS**

![alt](https://res.cloudinary.com/djfpzruso/image/upload/c_scale,w_800/v1683842042/10000rps_xoz2z7.png)
Result: 0% error-rate, 147ms latency

My CPU usage was reduced to 7.9%

![alt](https://res.cloudinary.com/djfpzruso/image/upload/c_scale,w_800/v1683842090/cpu_screenshot2_xvxitu.png)

## POST to Cart

**3500 RPS - alternated between 3 session_ids and skus**

![alt](https://res.cloudinary.com/djfpzruso/image/upload/c_scale,w_800/v1683842136/3000_post_rps_aeabdd.png)
INSERT queries are always going to be more performance heavy

CPU Usage went up to 43% for INSERT Queries

![alt](https://res.cloudinary.com/djfpzruso/image/upload/c_scale,w_800/v1683842187/cpu_screenshot3_hcdyli.png)

## Takeaways
Load Balancing with Nginx and Caching are absolutely invaluable tools, I was able to recieve up to 5000 RPS with 0% Error-Rate and 79ms latency with limited EC2 hardware. After scaling my Nginx Instance Vertically to a T2 xLarge, I was able to recieve up to 10000 RPS with 0% Error-Rate and 147mx latency! Given more time, I would do more research on using Redis Caching to add an additional layer of caching and optimizing my INSERT queries. 


## ☕ Owner
Tony Vo

