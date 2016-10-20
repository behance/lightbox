import $ from 'jquery';
import ChromeView from '../../src/ChromeView';

const imagePath = id => `/base/test/fixtures/images/img_${id}.png`;

const FIXTURE = `
  <div id="container">
    <img src="${imagePath(1)}" />
  </div>
`;
const CHROME_WRAP_CLASS = '.js-lightbox-wrap';
const PREV_CLASS = '.js-prev';
const NEXT_CLASS = '.js-next';
const HIDDEN_CLASS = 'hidden';
const expectPrevToBeHidden = () => expect($(PREV_CLASS)).toHaveClass(HIDDEN_CLASS);
const expectPrevToBeShown = () => expect($(PREV_CLASS)).not.toHaveClass(HIDDEN_CLASS);
const expectNextToBeHidden = () => expect($(NEXT_CLASS)).toHaveClass(HIDDEN_CLASS);
const expectNextToBeShown = () => expect($(NEXT_CLASS)).not.toHaveClass(HIDDEN_CLASS);

describe('ChromeView', function() {
  beforeEach(function() {
    const fixture = setFixtures(FIXTURE);
    this.$context = fixture.find('#container');
    this.controller = jasmine.createSpyObj('controller', [
      'on', 'off', 'next', 'prev', 'close', 'getPrevSlide', 'getNextSlide', 'deactivateSlide'
    ]);
    this.props = {};
    this.set = (props, slides) => {
      Object.keys(props).forEach(key => this.props[key] = props[key]);
      this.$img = this.$context.find('img').first();
      this.controller.slides = (slides || [
        { id: 0, data: {}, content: this.$img },
        { id: 1, data: {}, content: this.$img },
        { id: 2, data: {}, content: this.$img },
      ]);
      this.view = new ChromeView(this.$context, this.controller, this.props);
      this.listeners = this.controller.on.calls.first().args[0];
    };
    this.set({ imageSrcDataAttr: 'src' });
  });

  afterEach(function() {
    this.view.destroy();
  });

  describe('hide prev & next when only one slide is present', function() {
    beforeEach(function() {
      this.assert = () => {
        this.controller.slides = [{ id: 0, data: {}, content: this.$img }];
        this.listeners.activate(this.controller.slides[0]);
        expectPrevToBeHidden();
        expectNextToBeHidden();
      };
    });

    it('be hidden in circular', function() {
      this.set({ isCircular: true });
      this.assert();
    });

    it('be hidden in non-circular', function() {
      this.set({ isCircular: false });
      this.assert();
    });
  });

  it('should show prev & next when the active is the 2nd of 3', function() {
    this.controller.getPrevSlide.and.returnValue(this.controller.slides[0]);
    this.controller.getNextSlide.and.returnValue(this.controller.slides[2]);
    this.listeners.open(this.controller.slides[1]);
    expectPrevToBeShown();
    expectNextToBeShown();
  });

  it('should render the html contents of a slide', function() {
    this.set({}, [{ id: 0, data: {}, content: $('<div><button /></div>') }]);
    this.listeners.activate(this.controller.slides[0]);
    expect($(CHROME_WRAP_CLASS)).toContainElement('button');
  });

  describe('prev', function() {
    it('should hide prev when non-circular and is the first slide', function() {
      this.set({ isCircular: false });
      this.listeners.activate(this.controller.slides[0]);
      expectPrevToBeHidden();
    });

    it('should not hide prev when circular and is the first slide', function() {
      this.controller.getPrevSlide.and.returnValue(this.controller.slides[2]);
      this.set({ isCircular: true });
      this.listeners.activate(this.controller.slides[0]);
      expectPrevToBeShown();
    });
  });

  describe('next', function() {
    it('should hide next when non-circular and is the last slide', function() {
      this.set({ isCircular: false });
      this.listeners.activate(this.controller.slides[2]);
      expectNextToBeHidden();
    });

    it('should not hide prev when circular and is the last slide', function() {
      this.controller.getNextSlide.and.returnValue(this.controller.slides[0]);
      this.set({ isCircular: true });
      this.listeners.activate(this.controller.slides[2]);
      expectNextToBeShown();
    });
  });

  describe('controlled with a keyboard', function() {
    beforeEach(function() {
      this.triggerKey = keyCode => $(document).trigger({ type: 'keydown', keyCode });
      this.listeners.open();
    });

    it('should call controller.prev() when the left arrow is pressed', function() {
      this.triggerKey(37);
      expect(this.controller.prev).toHaveBeenCalled();
    });

    it('should call controller.next() when the right arrow is pressed', function() {
      this.triggerKey(39);
      expect(this.controller.next).toHaveBeenCalled();
    });

    it('should call controller.close() when the ESC is pressed', function() {
      this.triggerKey(27);
      expect(this.controller.close).toHaveBeenCalled();
    });
  });

  describe('renderSlide', function() {
    beforeEach(function() {
      this.view.open();
      this.$findSlide = id => $(`.js-slide[data-slide-id="${id}"]`);
      this.$findSlideContent = id => this.$findSlide(id).find('.js-slide-content');
    });

    it('should remove the current slide after slide out transition', function() {
      const slides = this.controller.slides;

      // (a) render 0, (b) render 1, (c) 0 must be deactivated

      this.view.renderSlide(slides[0]);
      expect(this.$findSlide(0)).toBeInDOM();

      this.view.renderSlide(slides[1]);
      this.$findSlideContent(0).trigger('transitionend');

      expect(this.$findSlide(0)).not.toBeInDOM();
      expect(this.controller.deactivateSlide).toHaveBeenCalledWith(slides[0]);
    });

    it('should not remove an active slide', function() {
      const slides = this.controller.slides;
      // simulating very quick next, prev, next motion
      this.view.renderSlide(slides[0]);
      this.view.renderSlide(slides[1]);
      this.view.renderSlide(slides[0]);
      this.$findSlideContent(0).trigger('transitionend');
      expect(this.$findSlide(0)).toBeInDOM();
    });
  });
});
