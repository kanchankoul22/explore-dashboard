'use strict';

describe('Datafilters E2E Tests:', function () {
  describe('Test Datafilters page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/datafilters');
      expect(element.all(by.repeater('datafilter in datafilters')).count()).toEqual(0);
    });
  });
});
