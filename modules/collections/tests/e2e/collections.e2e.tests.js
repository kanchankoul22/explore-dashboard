'use strict';

describe('Collections E2E Tests:', function () {
  describe('Test Collections page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/collections');
      expect(element.all(by.repeater('collection in collections')).count()).toEqual(0);
    });
  });
});
