import $ from 'jquery';

export default class Controller {
  constructor($context, props) {
    this._props = props;
    this._$context = $context;
    this._$eventNode = $('<e/>');
    this._$links = this._$context.find(`:not(a) > ${this._props.imageSelector}`);
    this.slides = this._createSlides(this._$links);
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
    this._trigger('open', [slide]);
  }

  close() {
    this._trigger('close');
  }

  next() {
    const nextId = this.activeSlide.id + 1;
    const next = this.slides[nextId];
    if (!this._props.isCircular && !next) { return; }
    const firstId = 0;
    this.activeSlide = this.slides[next ? nextId : firstId];
    this._trigger('next', this.activeSlide);
  }

  prev() {
    const prevId = this.activeSlide.id - 1;
    const prev = this.slides[prevId];
    if (!this._props.isCircular && !prev) { return; }
    const lastId = this.slides.length - 1;
    this.activeSlide = this.slides[prev ? prevId : lastId];
    this._trigger('prev', this.activeSlide);
  }

  destroy() {
    this.close();
    this._$eventNode.off();
    this._$links.removeClass('lightbox-link').off('click');
  }

  _bind() {
    const self = this;
    this._$links.addClass('lightbox-link').click(function(e) {
      e.stopPropagation();
      self.open(self.slides.filter(slide => slide.$node.is(this))[0].id);
    });
  }

  _trigger(eventName, params) {
    this._$eventNode.trigger(eventName, params);
  }

  _createSlides($links) {
    return $links
      .toArray()
      .map((node, i) => ({
        id: i,
        $node: $(node)
      }));
  }
}
