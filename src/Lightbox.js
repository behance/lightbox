import $ from 'jquery';
import idleTimer from 'idle-timer';
import LightboxImage from './LightboxImage';

const BACKDROP_TEMPLATE = '<div class="js-blocking" id="lightbox-blocking"></div>';
const ESCAPE_KEYCODE = 27;
const LEFT_ARROW_KEYCODE = 37;
const RIGHT_ARROW_KEYCODE = 39;

export default class Lightbox {
  constructor(options) {
    const config = Object.assign({
      context: document.body,
      idleTimeInMs: 5000,
      imageSelector: '.js-lightbox',
      imageSrcDataAttr: 'src',
      bgColor: '#fff',
      opacity: '0.94'
    }, options);

    this.fadeTimeInMs = 200;
    this.$body = $(document.body);
    this.$blocking = $(BACKDROP_TEMPLATE);
    this.images = [];
    this.activeImageId = false;
    this.isLoading = false;
    this.isSingle = false;
    this.$context = $(config.context);
    this.bgColor = config.bgColor;
    this.opacity = config.opacity;
    this.config = config;

    this.$context.find(config.imageSelector).each((i, el) => {
      const $img = $(el);
      $img.data('img-id', i).addClass('lightbox-link');
      this.images[i] = new LightboxImage(this, $img.data(config.imageSrcDataAttr), i);
    });

    const self = this;
    this.$context.find(`:not(a) > ${config.imageSelector}`).on('click', function(e) {
      e.stopPropagation();
      self.images[$(this).data('img-id')].render();
    });

    if (this.images.length === 1) {
      this.isSingle = true;
    }
  }

  close() {
    if (this.isLoading || this.activeImageId === false) {
      return;
    }

    this._destroyIdleTimer();
    this.$body.add(this.$context).off('click.lightbox');
    this.$activeImage.fadeOut(this.fadeTimeInMs, () => {
      this.$activeImage.remove();
      this.$activeImage = null;
      this.$body.find(this.$blocking).remove();
      this.$body.removeClass('lightbox-active');
      this.activeImageId = false;
    });
  }

  next() {
    this.images[(this.images[this.activeImageId + 1]) ? this.activeImageId + 1 : 0].render();
  }

  prev() {
    this.images[(this.images[this.activeImageId - 1]) ? this.activeImageId - 1 : this.images.length - 1].render();
  }

  bind() {
    this.$body.on('click.lightbox', () => {
      this.close();
    });

    $(document).on('keyup.lightbox', (e) => {
      if (e.keyCode === ESCAPE_KEYCODE) {
        this.close();
      }
    });

    if (this.isSingle) {
      return;
    }

    this.$context.on('click.lightbox', '.js-next', (e) => {
      e.stopPropagation();
      this.next();
    });

    this.$context.on('click.lightbox', '.js-prev', (e) => {
      e.stopPropagation();
      this.prev();
    });

    $(document).on('keyup.lightbox', (e) => {
      if (e.keyCode === LEFT_ARROW_KEYCODE) {
        this.prev();
      }
      else if (e.keyCode === RIGHT_ARROW_KEYCODE) {
        this.next();
      }
    });

    this._initIdleTimer();
  }

  _initIdleTimer() {
    this._idleTimer = idleTimer({
      callback: () => this._getActiveLightboxImage().hideExtras(),
      activeCallback: () => this._getActiveLightboxImage().showExtras(),
      idleTime: this.config.idleTimeInMs
    });
  }

  _destroyIdleTimer() {
    if (this._idleTimer) {
      this._idleTimer.destroy();
    }
  }

  _getActiveLightboxImage() {
    return this.images[this.activeImageId];
  }
}
