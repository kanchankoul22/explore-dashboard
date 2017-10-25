'use strict';

describe('Titles E2E Tests:', function () {
  describe('Test Titles page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/titles');
      expect(element.all(by.repeater('title in titles')).count()).toEqual(0);
    });
  });
});
