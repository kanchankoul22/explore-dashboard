'use strict';

describe('Hurdles E2E Tests:', function () {
  describe('Test Hurdles page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/hurdles');
      expect(element.all(by.repeater('hurdle in hurdles')).count()).toEqual(0);
    });
  });
});
