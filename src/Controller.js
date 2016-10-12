import $ from 'jquery';
// due to a bug in hoverintent, just import'ing it fails webpack
import hoverintent from 'hoverintent/dist/hoverintent.min';

const SLIDE_ID_ATTR = 'lightbox-slide-id';
const LINK_CLASS = 'lightbox-link';

export default class Controller {
  constructor($context, props) {
    this._props = props;
    this._$context = $context;
    this._$eventNode = $('<e/>');
    this._$links = this._$context.find(`:not(a) > ${this._props.slideSelector}`);
    this._hoverlisteners = [];
    this.slides = this._createSlides(this._$links);
    this._isOpen = false;
    this._bind();
  }

  on(eventName, cb) {
    const removeEvent = func => ((e, ...args) => func.apply(null, args));
    if (typeof eventName === 'object') {
      Object.keys(eventName).forEach(key => eventName[key] = removeEvent(eventName[key]));
    }
    this._$eventNode.on(eventName, removeEvent(cb));
  }

  off(eventName, cb) {
    this._$eventNode.off(eventName, cb);
  }

  open(slideId) {
    const slide = this.slides[slideId];
    this.activeSlide = slide;
    this._isOpen = true;
    this._trigger('open', [slide]);
  }

  close() {
    this._isOpen = false;
    this._trigger('close');
  }

  next() {
    const nextSlide = this.slides[this.getNextId()];
    if (!nextSlide) { return; }
    this.activeSlide = nextSlide;
    this._trigger('next', nextSlide);
  }

  prev() {
    const prevSlide = this.slides[this.getPrevId()];
    if (!prevSlide) { return; }
    this.activeSlide = prevSlide;
    this._trigger('prev', prevSlide);
  }

  getNextId() {
    const nextId = this.activeSlide.id + 1;
    const next = this.slides[nextId];
    if (!this._props.isCircular && !next) { return; }
    const firstId = 0;
    return next ? nextId : firstId;
  }

  getPrevId() {
    const prevId = this.activeSlide.id - 1;
    const prev = this.slides[prevId];
    if (!this._props.isCircular && !prev) { return; }
    const lastId = this.slides.length - 1;
    return prev ? prevId : lastId;
  }

  destroy() {
    this._isOpen && this.close();
    this._removePrefetchOnHover();
    this._$links
      .removeClass(LINK_CLASS)
      .removeData(SLIDE_ID_ATTR)
      .off('mousedown click');
    this._trigger('destroy');
    this._$eventNode.off();
  }

  _bind() {
    const self = this;
    this._$links.addClass(LINK_CLASS)
      .each((id, el) => {
        this._addPrefetchOnHover(el, id);
        $(el).data(SLIDE_ID_ATTR, id);
      })
      .on('mousedown', function() {
        self._trigger('prefetch', self.slides[$(this).data(SLIDE_ID_ATTR)]);
      })
      .on('click', function(e) {
        e.stopPropagation();
        self.open($(this).data(SLIDE_ID_ATTR));
      });
  }

  _trigger(eventName, params) {
    this._$eventNode.trigger(eventName, params);
  }

  _createSlides($links) {
    return $links
      .toArray()
      .map((node, i) => {
        const $node = $(node);
        return {
          id: i,
          src: $node.data('src'),
          content: $node.find(this._props.slideContentSelector).html()
        };
      });
  }

  _addPrefetchOnHover(el, id) {
    this._hoverlisteners.push(hoverintent(el,
      () => this._trigger('prefetch', this.slides[id]),
      () => {}));
  }

  _removePrefetchOnHover() {
    this._hoverlisteners.forEach(listener => listener.remove());
  }
}
