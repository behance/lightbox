import $ from 'jquery';
import lightbox from '../..';

describe('lightbox', function() {
  const IMG_WIDTH = 50;
  const FADE_TIME = 5;
  const BLOCKING_CLASS = '.js-blocking';
  const LIGHTBOX_CLASS = '.js-lightbox';
  const NEXT_CLASS = '.js-next';
  const PREVIOUS_CLASS = '.js-prev';
  const CLOSE_CLASS = '.js-close';
  const HOVER_ICON_CLASS = 'hover-icon-enabled';
  const img = (id) => `img[src$="${id}.png"]`;
  const imagePath = (id) => `/base/test/fixtures/images/img_${id}.png`;

  // This is temporary. I don't want to update the code to add proper
  // events before putting the existing code inside a test harness.
  // The duration is just a bit longer than the fadeIn + fadeOut duration.
  function tempWait(fn) {
    setTimeout(fn, 2 * FADE_TIME + 16);
  }

  beforeEach(function() {
    const lightboxDiv = (id) => `${LIGHTBOX_CLASS}[data-src="${imagePath(id)}"] img[style="width:${IMG_WIDTH}px;height:50px"]`;
    affix(`${lightboxDiv(1)}+${lightboxDiv(2)}`);

    this.init = (...args) => this.unit = lightbox.init.apply(lightbox, args);
  });

  afterEach(function() {
    this.unit.destroy();
  });

  it('should render the blocking div when clicked on the lightbox node', function() {
    this.init();
    expect($(BLOCKING_CLASS).is(':off-screen')).toBeTruthy();
    $(LIGHTBOX_CLASS).first().click();
    expect($(BLOCKING_CLASS).is(':off-screen')).not.toBeTruthy();
  });

  describe('previous/next buttons', function() {
    beforeEach(function(done) {
      this.init();
      $(LIGHTBOX_CLASS).first().click();
      tempWait(() => {
        const $next = $(NEXT_CLASS);
        expect($next).toBeVisible();

        expect($(img(1)).is(':off-screen')).toBeFalsy();
        expect($(img(2)).is(':off-screen')).toBeTruthy();
        expect($(img(1)).parent().css('opacity')).toBe('1');
        expect($(img(2)).parent().css('opacity')).toBe('0');

        $next.click();

        tempWait(done);
      });
    });

    it('should go to the next image when clicking on the next button', function() {
      expect($(img(1)).parent().css('opacity')).toBe('0');
      expect($(img(2)).parent().css('opacity')).toBe('1');
      expect($(img(2)).is(':off-screen')).toBeFalsy();
    });

    it('should go to the previous image when clicking on the previous button', function(done) {
      const $previous = $(PREVIOUS_CLASS);
      $previous.click();

      tempWait(() => {
        expect($(img(1)).parent().css('opacity')).toBe('1');
        expect($(img(2)).parent().css('opacity')).toBe('0');
        done();
      });
    });
  });

  describe('zoom', function() {
    beforeEach(function(done) {
      const originalHeightFn = $.prototype.height;
      spyOn($.prototype, 'width').and.callFake(() => {
        if (this[0] === window) {
          return IMG_WIDTH - 1;
        }
        return originalHeightFn.apply(this, arguments);
      });

      this.init();
      $(LIGHTBOX_CLASS).first().click();
      tempWait(done);
    });

    it('should toggle zoomed class when clicking on image', function(done) {
      const $zoomable = this.unit._$context.find('.js-slide-content.zoomable');
      $zoomable.click();

      tempWait(() => {
        expect($('html')).toHaveClass('lightbox-zoomed');
        $zoomable.click();

        tempWait(() => {
          expect($('html')).not.toHaveClass('lightbox-zoomed');
          done();
        });
      });
    });
  });

  it('should hide non-img elements such as the close class after inactivity', function(done) {
    this.init({ idleTimeInMs: 10 });
    $(LIGHTBOX_CLASS).first().click();
    tempWait(() => {
      setTimeout(() => {
        expect($(CLOSE_CLASS).css('opacity')).toBeLessThan(1);
        done();
      }, 15);
    });
  });

  it('should add hover icon class by default', function() {
    this.init();
    expect($(LIGHTBOX_CLASS)).toHaveClass(HOVER_ICON_CLASS);
  });

  it('should not add hover icon class if disabled', function() {
    this.init({
      hoverIconEnabled: false,
    });
    expect($(LIGHTBOX_CLASS)).not.toHaveClass(HOVER_ICON_CLASS);
  });
});
