'use strict';

describe('Displaytimings E2E Tests:', function () {
  describe('Test Displaytimings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/displaytimings');
      expect(element.all(by.repeater('displaytiming in displaytimings')).count()).toEqual(0);
    });
  });
});
