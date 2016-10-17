import $ from 'jquery';
import ChromeView from '../../src/ChromeView';

const imagePath = id => `/base/test/fixtures/images/img_${id}.png`;

const FIXTURE = `
  <div id="container">
    <img data-src="${imagePath(1)}" />
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
      'on', 'off', 'next', 'prev', 'getPrevSlide', 'getNextSlide'
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
        this.listeners.open(this.controller.slides[0]);
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
    this.listeners.open(this.controller.slides[0]);
    expect($(CHROME_WRAP_CLASS)).toContainElement('button');
  });

  describe('prev', function() {
    it('should hide prev when non-circular and is the first slide', function() {
      this.set({ isCircular: false });
      this.listeners.open(this.controller.slides[0]);
      expectPrevToBeHidden();
    });

    it('should not hide prev when circular and is the first slide', function() {
      this.controller.getPrevSlide.and.returnValue(this.controller.slides[2]);
      this.set({ isCircular: true });
      this.listeners.open(this.controller.slides[0]);
      expectPrevToBeShown();
    });
  });

  describe('next', function() {
    it('should hide next when non-circular and is the last slide', function() {
      this.set({ isCircular: false });
      this.listeners.open(this.controller.slides[2]);
      expectNextToBeHidden();
    });

    it('should not hide prev when circular and is the last slide', function() {
      this.controller.getNextSlide.and.returnValue(this.controller.slides[0]);
      this.set({ isCircular: true });
      this.listeners.open(this.controller.slides[2]);
      expectNextToBeShown();
    });
  });
});
