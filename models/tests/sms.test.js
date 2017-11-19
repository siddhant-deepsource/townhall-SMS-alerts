'use strict';
require('dotenv').config();
const request = require('superagent');
const expect = require('expect');
const server = require('../../lib/server');

describe('SMS', () => {
  beforeAll(() => {
    process.env.PORT = 5000;
    server.start();
  });
  afterAll(server.stop);

  describe('POST /sms', () => {
    xtest('should respond with a 200 when there is an incoming zipcode', () => {
      let url = `http://localhost:${process.env.PORT}/sms`;
      let incoming = 'Body=98122';
      return request.post(url)
        .send(incoming)
        .then(res => {
          expect(res.text).toBe('<?xml version="1.0" encoding="UTF-8"?><Response><Message>There are not any upcoming town halls in your area.</Message></Response>');
          expect(res.status).toEqual(200);
        });
    });
  });
});
