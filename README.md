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
![alt](https://file.notion.so/f/s/2adf3335-3dbd-42ee-a606-bd35d3c81173/Untitled.png?id=65617835-293e-412c-8d5d-96c8829fad79&table=block&spaceId=2a363adf-b596-4270-823e-50a4b7bb0c67&expirationTimestamp=1681338927150&signature=iHcxpf6FAM93hNf1icNQ3R3ZISK7chg5eWVB9TltLUU&downloadName=Untitled.png)
Results: 0% error-rate, 997ms latency

### POST to Cart

**1000 RPS**
![alt](https://file.notion.so/f/s/50722ad4-9da2-4834-89f8-6d29020fb651/Untitled.png?id=0e0e44ab-6458-4735-bd87-230023cacd88&table=block&spaceId=2a363adf-b596-4270-823e-50a4b7bb0c67&expirationTimestamp=1681339010756&signature=7gYVnQ8P6Pr5y0NKLuye7OLSFyvTX5njqXck8rF7FfM&downloadName=Untitled.png)
Results: 0.0% error-rate, 559ms latency

## After Nginx Load Balancing and Caching
### GET Products - testing between product_id 800,000 - 1,000,011

**1000 RPS**
![alt](https://file.notion.so/f/s/3110b56a-0e0e-4776-a20c-2728524a8dc4/Untitled.png?id=6ef0df5d-3a6c-4374-ad27-8dbfd8f8efb0&table=block&spaceId=2a363adf-b596-4270-823e-50a4b7bb0c67&expirationTimestamp=1681339172850&signature=JqVXYt9yIMkhk1LRPC4Ey2uCXzDzOlJjRk431Nz3I_Q&downloadName=Untitled.png)
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
![alt](https://file.notion.so/f/s/371785f2-2bc4-4bd5-b160-a16611a4ac99/Untitled.png?id=b713e8b9-b32b-4d5e-a49d-4ab77c51a7b1&table=block&spaceId=2a363adf-b596-4270-823e-50a4b7bb0c67&expirationTimestamp=1681339344327&signature=fkdJwhySla6ZGSkFSknytXNMDGrrO0HPuDVsNGzI4Hc&downloadName=Untitled.png)
Before keep alives: 0.5% error-rate and 121ms latency
New Results: 0% error-rate and 89ms latency, 0 timeouts

### POST to Cart

**switching between 3 session_ids and skus**

**1000 RPS - after load balancer, caching and keep alives configured**
![alt](https://file.notion.so/f/s/6dcb22fc-5511-4c35-9c2f-513366818281/Untitled.png?id=2eddf188-ede2-4fd9-9c61-b1e6ad728c15&table=block&spaceId=2a363adf-b596-4270-823e-50a4b7bb0c67&expirationTimestamp=1681339403163&signature=8CcHS1fWxQYtlkmxolxCXN2aZlCRbFjFDjEpv633FyY&downloadName=Untitled.png)
Previous Results: 0% error-rate, 559ms latency
New Results: 0% error rate, 67ms latency


After configuring my keep alives, I decided to push my RPS to the limit. I decided to test my GET Products route testing product_ids randomly between 800K to 1 million. 

**5000RPS**
![alt](https://file.notion.so/f/s/2bfc2c1c-d0b0-433a-b9b6-660fef3f75d8/Untitled.png?id=76491103-98a4-41eb-aae6-f99cc7172725&table=block&spaceId=2a363adf-b596-4270-823e-50a4b7bb0c67&expirationTimestamp=1681339560533&signature=cekojDj5w5HYSH_YoNs9l9B4_qpIfBUCqJHCYiRxlMQ&downloadName=Untitled.png)
Results: 0% error - rate, 79ms latency

I pushed up to 8000 RPS and reached a 4.1% error-rate, 126ms latency, and 19850 requests with a 500 Status Error. Adding a 5th API Instance did not show any improvement. Checking my CPU usage of my Nginx Server showed that my CPU usage was pushed to 68%.
![alt](https://file.notion.so/f/s/7eaa2e6f-16bd-4e91-a5e3-2f79ca210724/Screen_Shot_2023-02-24_at_7.53.10_PM.png?id=eb99a23c-fae1-4f1e-bc55-78f650ae3d18&table=block&spaceId=2a363adf-b596-4270-823e-50a4b7bb0c67&expirationTimestamp=1681339678747&signature=iDtAZAjZhp24ELDHWFTQxqw-8U2kgC3Lh8_VkpG7e_I&downloadName=Screen+Shot+2023-02-24+at+7.53.10+PM.png)

As an experiment, I decided to scale my Nginx vertically to see if I could push my stress testing

### T2 xlarge - 4 CPUs and 16 GB RAM

**8000 RPS**
![alt](https://file.notion.so/f/s/cda34244-7ae7-45fb-9cbe-bf283cf6cfb8/Untitled.png?id=0a0bb991-6e50-4e35-86ba-e45057a2b287&table=block&spaceId=2a363adf-b596-4270-823e-50a4b7bb0c67&expirationTimestamp=1681339722191&signature=ZwEKii-_Ojz7B-jZAIRlX21DaDq8EsfENeb4WwS5Bow&downloadName=Untitled.png)
Previous Result: 4.1% error-rate, 129ms latency, 19850 requests with 500 Status Error.
New Result: 0% error-rate, 110ms latency

**10000 RPS**
![alt](https://file.notion.so/f/s/933d1012-c4cc-4965-a96b-ea669c776721/Untitled.png?id=0aa08ebd-e44d-45fc-a67b-8fa0ad0298b1&table=block&spaceId=2a363adf-b596-4270-823e-50a4b7bb0c67&expirationTimestamp=1681339772099&signature=O-ByOuTAmUVurijpVD6Ww1OBIgPZbLQ8MlC0_Bg_kWk&downloadName=Untitled.png)
Result: 0% error-rate, 147ms latency

My CPU usage was reduced to 7.9%
![alt](https://file.notion.so/f/s/b2868047-25b0-42a3-9b3d-ae29cf1c4adc/Screen_Shot_2023-02-24_at_8.17.25_PM.png?id=fb0e39e9-600c-40c6-a3f3-6fbb003e3f39&table=block&spaceId=2a363adf-b596-4270-823e-50a4b7bb0c67&expirationTimestamp=1681339809052&signature=9rb_xZC4rP8ZxAuy1b7JNqa67il4-h3KAuAB0jzNPSM&downloadName=Screen+Shot+2023-02-24+at+8.17.25+PM.png)

## POST to Cart

**3500 RPS - alternated between 3 session_ids and skus**
![alt](https://file.notion.so/f/s/3829f1a0-8fbf-4a21-a320-10817dc1fda0/Untitled.png?id=de202855-ce24-4270-b01b-67c5887c68ab&table=block&spaceId=2a363adf-b596-4270-823e-50a4b7bb0c67&expirationTimestamp=1681339844828&signature=BFUaK5svabak4LjIjkoXdrG7e38GmN-OZDEZL6kj3rc&downloadName=Untitled.png)
INSERT queries are always going to be more performance heavy

CPU Usage went up to 43% for INSERT Queries
![alt](https://file.notion.so/f/s/1c88f46f-8655-4c6d-9775-f7b0fb9d5f11/Screen_Shot_2023-02-24_at_8.18.46_PM.png?id=b4311d78-18bf-416d-968f-f57b62beae7d&table=block&spaceId=2a363adf-b596-4270-823e-50a4b7bb0c67&expirationTimestamp=1681526231942&signature=B6Un4xai7zewp1wc1iLF7xvklXn3s4P26TOn5En7--A&downloadName=Screen+Shot+2023-02-24+at+8.18.46+PM.png)

## Takeaways
Load Balancing with Nginx and Caching are absolutely invaluable tools, I was able to recieve up to 5000 RPS with 0% Error-Rate and 79ms latency with limited EC2 hardware. After scaling my Nginx Instance Vertically to a T2 xLarge, I was able to recieve up to 10000 RPS with 0% Error-Rate and 147mx latency! Given more time, I would do more research on using Redis Caching to add an additional layer of caching and optimizing my INSERT queries. 


## ☕ Owner
Tony Vo

