'use strict';

describe('Collectionsets E2E Tests:', function () {
  describe('Test Collectionsets page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/collectionsets');
      expect(element.all(by.repeater('collectionset in collectionsets')).count()).toEqual(0);
    });
  });
});
