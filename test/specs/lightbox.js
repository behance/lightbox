/* eslint-env jasmine */
/* global affix */

import $ from 'jquery';
import lightbox from '../../lightbox';

describe('lightbox', function() {
  const FADE_TIME = 200;
  const BLOCKING_CLASS = '.js-blocking';
  const LIGHTBOX_CLASS = '.js-lightbox';
  const NEXT_CLASS = '.js-next';
  const CLOSE_CLASS = '.js-close';
  const imagePath = (id) => `/base/test/fixtures/images/img_${id}.png`;

  // This is temporary. I don't want to update the code to add proper
  // events before putting the existing code inside a test harness.
  // The duration is just a bit longer than the fadeIn + fadeOut duration.
  function tempWait(fn) {
    setTimeout(fn, 2 * FADE_TIME + 16);
  }

  // must close it before running another test as there is no destructor
  function close(done) {
    tempWait(() => {
      $(CLOSE_CLASS).click();
      tempWait(() => {
        expect($(BLOCKING_CLASS)).not.toBeVisible();
        done();
      });
    });
  }

  beforeEach(function() {
    const lightboxDiv = (id) => `${LIGHTBOX_CLASS}[data-src="${imagePath(id)}"] img[style="width:50px;height:50px"]`;
    affix(`${lightboxDiv(1)}+${lightboxDiv(2)}`);
  });

  describe('init', function() {
    it('should be a function', function() {
      expect(lightbox.init).toEqual(jasmine.any(Function));
    });

    it('should render the blocking div when clicked', function(done) {
      lightbox.init();
      expect($(BLOCKING_CLASS)).not.toBeVisible();
      $(LIGHTBOX_CLASS).first().click();
      expect($(BLOCKING_CLASS)).toBeVisible();
      close(done);
    });
  });

  it('should go to the next image when clicking on the next button', function(done) {
    lightbox.init();
    $(LIGHTBOX_CLASS).first().click();
    tempWait(() => {
      const $next = $(NEXT_CLASS);
      const img = (id) => `img[src$="${id}.png"]`;

      expect($next).toBeVisible();
      expect($(img(1))).toBeVisible();
      expect($(img(2))).not.toBeVisible();

      $next.click();

      tempWait(() => {
        expect($(img(1))).not.toBeVisible();
        expect($(img(2))).toBeVisible();
        close(done);
      });
    });
  });
});
