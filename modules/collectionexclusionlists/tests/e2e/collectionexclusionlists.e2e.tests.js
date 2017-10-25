'use strict';

describe('Collectionexclusionlists E2E Tests:', function () {
  describe('Test Collectionexclusionlists page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/collectionexclusionlists');
      expect(element.all(by.repeater('collectionexclusionlist in collectionexclusionlists')).count()).toEqual(0);
    });
  });
});
