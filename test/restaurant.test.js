
const { TEST_DATABASE_URL, TEST_PORT } = require('../config');
process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require('../index');
const { User } = require('../restaurant');
const expect = chai.expect;
chai.use(chaiHttp);