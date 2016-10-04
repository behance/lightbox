import $ from 'jquery';
import lightbox from '../..';

describe('lightbox', function() {
  const FADE_TIME = 5;
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

  afterEach(function(done) {
    close(done);
  });

  it('should render the blocking div when clicked on the lightbox node', function() {
    lightbox.init();
    expect($(BLOCKING_CLASS)).not.toBeVisible();
    $(LIGHTBOX_CLASS).first().click();
    expect($(BLOCKING_CLASS)).toBeVisible();
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
        done();
      });
    });
  });

  it('should hide non-img elements such as the close class after inactivity', function(done) {
    lightbox.init({ idleTimeInMs: 10 });
    $(LIGHTBOX_CLASS).first().click();
    tempWait(() => {
      setTimeout(() => {
        expect($(CLOSE_CLASS).css('opacity')).toBeLessThan(1);
        done();
      }, 15);
    });
  });

  it('should support data-picture in the lightbox image', function(done) {
    affix(`.picture-lightbox[data-picture="${JSON.stringify({
      sources: [{ srcset: imagePath(1), media_query: '(min-width: 1px)' }],
      img: { src: imagePath(1) }
    }).replace(/"/g, '&quot;')}"] img[style="width:50px;height:50px"]`);
    lightbox.init({ slideSelector: '.picture-lightbox' });
    $('.picture-lightbox').first().click();
    tempWait(() => {
      expect($('img[src$="1.png"]')).toBeVisible();
      done();
    });
  });
});
