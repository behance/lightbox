/* eslint-env jasmine */

import lightbox from '../../lightbox';

describe('lightbox', function() {
  describe('init', function() {
    it('should be a function', function() {
      expect(lightbox.init).toEqual(jasmine.any(Function));
    });
  });
});
