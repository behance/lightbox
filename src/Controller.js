import $ from 'jquery';

export default class Controller {
  constructor($context, props) {
    this._props = props;
    this._$context = $context;
    this._$eventNode = $('<e/>');
    this._$links = this._$context.find(`:not(a) > ${this._props.imageSelector}`);
    this._slides = this._createSlides(this._$links);
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
    const slide = this._slides[slideId];
    this._activeSlideId = slide.id;
    this._trigger('open', [slide]);
  }

  close() {
    this._trigger('close');
  }

  next() {
    const next = this._slides[this._activeSlideId + 1];
    if (!this._props.isCircular && !next) { return; }

    const firstId = 0;
    const nextId = this._activeSlideId + 1;
    this._activeSlideId = next ? nextId : firstId;
    const activeSlide = this._slides[this._activeSlideId];

    this._trigger('next', activeSlide);
  }

  prev() {
    const prev = this._slides[this._activeSlideId - 1];
    if (!this._props.isCircular && !prev) { return; }

    const lastId = this._slides.length - 1;
    const prevId = this._activeSlideId - 1;
    this._activeSlideId = prev ? prevId : lastId;
    const activeSlide = this._slides[this._activeSlideId];

    this._trigger('prev', activeSlide);
  }

  hideExtras() {
    this._trigger('extrasHidden');
  }

  showExtras() {
    this._trigger('extrasShown');
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
      self.open(self._slides.filter(slide => slide.$node.is(this))[0].id);
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
