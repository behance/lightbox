import $ from 'jquery';
import lightbox from '../..';

describe('lightbox', function() {
  const FADE_TIME = 5;
  const BLOCKING_CLASS = '.js-blocking';
  const LIGHTBOX_CLASS = '.js-lightbox';
  const NEXT_CLASS = '.js-next';
  const CLOSE_CLASS = '.js-close';
  const HOVER_ICON_CLASS = 'hover-icon-enabled';
  const imagePath = (id) => `/base/test/fixtures/images/img_${id}.png`;

  // This is temporary. I don't want to update the code to add proper
  // events before putting the existing code inside a test harness.
  // The duration is just a bit longer than the fadeIn + fadeOut duration.
  function tempWait(fn) {
    setTimeout(fn, 2 * FADE_TIME + 16);
  }

  beforeEach(function() {
    const lightboxDiv = (id) => `${LIGHTBOX_CLASS}[data-src="${imagePath(id)}"] img[style="width:50px;height:50px"]`;
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

  it('should go to the next image when clicking on the next button', function(done) {
    this.init();
    $(LIGHTBOX_CLASS).first().click();
    tempWait(() => {
      const $next = $(NEXT_CLASS);
      const img = (id) => `img[src$="${id}.png"]`;

      expect($next).toBeVisible();
      expect($(img(1))).toBeVisible();
      expect($(img(2)).is(':off-screen')).toBeTruthy();

      $next.click();

      tempWait(() => {
        expect($(img(1)).parent().css('opacity')).toBe('0');
        expect($(img(2))).toBeVisible();
        done();
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
      hoverIconEnabled: false
    });
    expect($(LIGHTBOX_CLASS)).not.toHaveClass(HOVER_ICON_CLASS);
  });
});
