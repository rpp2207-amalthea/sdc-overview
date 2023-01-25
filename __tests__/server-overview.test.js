const { expect } = require('chai');
const request = require('supertest');
const Pool = require('pg-pool');
const client = require('../db/index.js')

const initGetData = require('../server/controllers/initGetData'); //this is the app
