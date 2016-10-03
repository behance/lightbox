import $ from 'jquery';
import Chrome from './Chrome';

export default class Lightbox {
  constructor(props) {
    this._props = Object.assign({
      context: document.body,
      idleTimeInMs: 5000,
      imageSelector: '.js-lightbox',
      imageSrcDataAttr: 'src',
      bgColor: '#fff',
      opacity: '0.94',
      isCircular: true
    }, props);

    this._$context = $(this._props.context);
    this._$links = this._$context.find(`:not(a) > ${this._props.imageSelector}`);
    this._slides = this._createSlides(this._$links);

    this._chrome = new Chrome({
      $context: this._$context,
      onnext: () => this.next(),
      onprev: () => this.prev(),
      onclose: () => this.close(),
      bgColor: this._props.bgColor,
      opacity: this._props.opacity,
      imageSrcDataAttr: this._props.imageSrcDataAttr,
      idleTimeInMs: this._props.idleTimeInMs,
    });

    this.init();
  }

  init() {
    const self = this;
    this._$links.addClass('lightbox-link').click(function(e) {
      e.stopPropagation();
      self.open(self._slides.filter(slide => slide.$node.is(this))[0]);
    });
  }

  destroy() {
    this._$links.removeClass('lightbox-link').off('click');
    this.close();
  }

  open(slide) {
    this._chrome.init();
    this._activeSlideId = slide.id;
    this._chrome.renderSlide(slide);
  }

  close() {
    this._chrome.destroy();
  }

  next() {
    const next = this._slides[this._activeSlideId + 1];
    const firstId = 0;
    const nextId = this._activeSlideId + 1;
    if (!this._props.isCircular && !next) { return; }
    this._activeSlideId = next ? nextId : firstId;
    this._chrome.renderSlide(this._slides[this._activeSlideId]);
  }

  prev() {
    const prev = this._slides[this._activeSlideId - 1];
    const lastId = this._slides.length - 1;
    const prevId = this._activeSlideId - 1;
    if (!this._props.isCircular && !prev) { return; }
    this._activeSlideId = prev ? prevId : lastId;
    this._chrome.renderSlide(this._slides[this._activeSlideId]);
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
