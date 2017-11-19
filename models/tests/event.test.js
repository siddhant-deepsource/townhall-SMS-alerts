'use strict';

const TownHall = require('../event');
const testTownHallData = require('./mockTownHall');

describe('class TownHall', () => {
  describe('townhall constructor', () => {
    test('it should return an instance of townhall', () => {
      let testTownHallObject = new TownHall(testTownHallData);
      expect(testTownHallObject.moc).toEqual(testTownHallData.Member);

    });
  });

  describe('includeTownHall method', () => {

    test('it should return true if the given district matches the townhall district', () => {
      let districtObj = {
        states: ['TX'],
        districts: ['TX-33'],
      };
      let newTownHall = new TownHall(testTownHallData);
      let include = newTownHall.includeTownHall(districtObj);
      expect(include).toBe(true);
    });

    test('it should return false if the given district does not match the townhall district', () => {
      let districtObj = {
        states: ['CA'],
        districts: ['CA-09'],
      };
      let newTownHall = new TownHall(testTownHallData);
      let include = newTownHall.includeTownHall(districtObj);
      expect(include).toBe(false);
    });

    test('it should return false if the given district does not match the townhall district', () => {
      let districtObj = {

      };
      let newTownHall = new TownHall(testTownHallData);
      let failure = function() {
        newTownHall.includeTownHall(districtObj);
      };
      expect(failure).toThrow('The requested state not found');
    });
    test('it should return a message if townhalls exsist', ()=> {
      let newTownHall = new TownHall(testTownHallData);
      let include = newTownHall.print();
      expect(include).toEqual('Marc Veasey is holding a townhall at 9:30 AM, Fri, Nov 17, 2017. Address: TCC South Campus Recital Hall, 5301 Campus Dr, Fort Worth, TX 76119.');
    });
  });
});
