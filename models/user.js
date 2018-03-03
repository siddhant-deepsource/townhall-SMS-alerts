'use strict';

const firebasedb = require('../lib/firebaseinit');

module.exports = class User {
  constructor (req){
    this.phoneNumber = req.body.From;
    this.zipcode = req.session.zipcode;
  }

  writeToFirebase(req, firebasemock) {
    let updates = {};
    let user = {};

    let userPath = 'sms-users/all-users/';
    let userPostKey = `${this.phoneNumber}`;

    let firebaseref = firebasemock || firebasedb.ref();
    req.session.districts.forEach(district => {
      let path = `sms-users/${district.state}/${district.district}/`;
      let newPostKey = `${this.phoneNumber}-${this.zipcode}`;
      updates[path + newPostKey] = this;
    });

    user[userPath + userPostKey] = this.zipcode;

    firebaseref.update(user);
    return firebaseref.update(updates);
  }

  deleteFromFirebase(req, firebasemock) {
  }
};
