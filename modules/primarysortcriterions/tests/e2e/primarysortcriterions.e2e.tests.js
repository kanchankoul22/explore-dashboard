'use strict';

describe('Primarysortcriterions E2E Tests:', function () {
  describe('Test Primarysortcriterions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/primarysortcriterions');
      expect(element.all(by.repeater('primarysortcriterion in primarysortcriterions')).count()).toEqual(0);
    });
  });
});
