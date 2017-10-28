'use strict';

describe('Dataexclusions E2E Tests:', function () {
  describe('Test Dataexclusions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/dataexclusions');
      expect(element.all(by.repeater('dataexclusion in dataexclusions')).count()).toEqual(0);
    });
  });
});
