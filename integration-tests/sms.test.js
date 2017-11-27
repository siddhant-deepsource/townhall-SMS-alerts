'use strict';

const request = require('superagent');
const expect = require('expect');
const server = require('../lib/server');
const xml2jsParser = require('superagent-xml2jsparser');
let url;

beforeAll(() => {
  jest.dontMock('firebase-admin');
  let port = 5000;
  url = `http://localhost:${port}/sms`;
  const server = require('../lib/server.js');
  const express = require('express');
  const smsRouter = require('../routes/sms');
  const app = express();
  const messaging = require('../lib/response');
  const session = require('express-session');
  const reqTwiml = require('../routes/sessionMiddleware');


  app.use(session({
    secret: 'sessionSecret',
    resave: false,
    saveUninitialized: false,
  }));

  app.use(reqTwiml, smsRouter);

  app.use((err, req, res, next) => {
    console.log('err', err.message);
    messaging.sendAndWrite(req, res, err.message);
    next();
  });
  server.start(app, port);
});
afterAll(server.stop);

describe('SMS', () => {
  describe('POST /sms', () => {
    test('should respond with a 200 when there is an incoming zipcode', () => {
      let incoming = {Body: '98122'};
      return request
        .post(url)
        .type('form')
        .send(incoming)
        .parse(xml2jsParser)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.Response.Message).toEqual([ 'There are not any upcoming town halls in your area. Send subscribe <zip code> to get reoccuring updates.' ]);
        });

    });

    test('should respond with a 200 when there is an incoming bad zipcode but will prompt for a zip code.', () => {
      let incoming = {Body: 'thisshouldfail'};

      return request
        .post(url)
        .type('form')
        .send(incoming)
        .parse(xml2jsParser)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.Response.Message).toEqual([ 'Please send us a zipcode to get upcoming events for your reps.' ]);
        });
    });

    test('should respond with a 200 when there is an incoming bad zipcode but will prompt for a zip code', () => {
      let incoming = {Body: '99999'};

      return request
        .post(url)
        .type('form')
        .send(incoming)
        .parse(xml2jsParser)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.Response.Message).toEqual(['We could not find that zip code.']);
        });
    });
    test('should return message from an array', ()=>{
      let incoming = {Body : '27278'};

      return request
        .post(url)
        .type('form')
        .send(incoming)
        .parse(xml2jsParser)
        .then(res => {
          expect(Array.isArray(res.body.Response.Message)).toBe(true);
        });
    });
  });
});
