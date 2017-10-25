'use strict';

describe('Criterions E2E Tests:', function () {
  describe('Test Criterions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/criterions');
      expect(element.all(by.repeater('criterion in criterions')).count()).toEqual(0);
    });
  });
});
