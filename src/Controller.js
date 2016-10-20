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
    if (!slide) { return; }
    this._isOpen = true;
    this._trigger('open', slide);
    this.activateSlide(slide);
  }

  close() {
    this._isOpen = false;
    this.deactivateSlide(this.activeSlide);
    this._trigger('close');
  }

  next() {
    this.activateSlide(this.getNextSlide());
  }

  prev() {
    this.activateSlide(this.getPrevSlide());
  }

  getNextSlide() {
    return this._getSlideByDirection(1);
  }

  getPrevSlide() {
    return this._getSlideByDirection(-1);
  }

  activateSlide(slide) {
    if (!slide) { return; }
    this.activeSlide = slide;
    this._trigger('activate', slide);
  }

  deactivateSlide(slide) {
    if (!slide) { return; }
    this._trigger('deactivate', slide);
  }

  destroy() {
    if (this._isOpen) {
      this.close();
    }
    this._removePrefetchOnHover();
    this._$links
      .removeClass(LINK_CLASS)
      .removeData(SLIDE_ID_ATTR)
      .off('.lightbox');
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
      .on('mousedown.lightbox', function() {
        self._trigger('prefetch', self.slides[$(this).data(SLIDE_ID_ATTR)]);
      })
      .on('click.lightbox', function(e) {
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
          data: $node.data(),
          content: $node.find(this._props.slideContentSelector).html()
        };
      });
  }

  _getSlideByDirection(direction) {
    const id = this.activeSlide.id + direction;
    const slide = this.slides[id];
    if (slide) { return slide; }
    if (this._props.isCircular) {
      return this.slides[(direction === -1) ? (this.slides.length - 1) : 0];
    }
  }

  _addPrefetchOnHover(el, id) {
    this._hoverlisteners.push(
      hoverintent(
        el,
        () => this._trigger('prefetch', this.slides[id]),
        () => {}
      )
    );
  }

  _removePrefetchOnHover() {
    this._hoverlisteners.forEach(listener => listener.remove());
  }
}
