import $ from 'jquery';
import tinycolor from 'tinycolor2';
import 'style!./sass/lightbox.scss';

const ESCAPE_KEYCODE = 27;
const LEFT_ARROW_KEYCODE = 37;
const RIGHT_ARROW_KEYCODE = 39;
const FADE_TIME = 200;
const BACKDROP_TEMPLATE = '<div class="js-blocking" id="lightbox-blocking"></div>';
const LIGHTBOX_TEMPLATE = `
  <div class="js-lightbox-wrap" id="lightbox-wrap">
    <div class="js-lightbox-inner-wrap" id="lightbox-inner-wrap">
      <div class="js-img-wrap" id="lightbox-img-wrap">
        <div class="control prev js-control js-prev">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" width="60" height="60" viewBox="0 0 60 60" xml:space="preserve">
            <circle class="lightbox-icon-bg" cx="30" cy="30" r="30"/>
            <path class="lightbox-icon-arrow" d="M28.6 30l7.9-7.9c0.5-0.5 0.7-1.1 0.7-1.7s-0.2-1.2-0.7-1.7c-0.9-0.9-2.5-0.9-3.4 0l-9.6 9.6c-0.5 0.5-0.7 1.1-0.7 1.7s0.2 1.2 0.7 1.7l9.6 9.6c0.9 0.9 2.5 0.9 3.4 0 0.5-0.5 0.7-1.1 0.7-1.7 0-0.6-0.2-1.2-0.7-1.7L28.6 30z"/>
          </svg>
        </div>
        <div class="control next js-control js-next">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" width="60" height="60" viewBox="0 0 60 60" xml:space="preserve">
            <circle class="lightbox-icon-bg" cx="30" cy="30" r="30"/>
            <path class="lightbox-icon-arrow" d="M31.4 30l-7.9 7.9c-0.5 0.5-0.7 1.1-0.7 1.7 0 0.6 0.2 1.2 0.7 1.7 0.9 0.9 2.5 0.9 3.4 0l9.6-9.6c0.5-0.5 0.7-1.1 0.7-1.7s-0.2-1.2-0.7-1.7l-9.6-9.6c-0.9-0.9-2.5-0.9-3.4 0 -0.5 0.5-0.7 1.1-0.7 1.7 0 0.6 0.2 1.2 0.7 1.7L31.4 30z"/>
          </svg>
        </div>
        <div class="control close js-control js-close">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" viewBox="0 0 26 26" preserveAspectRatio="xMidYMid meet">
            <rect x="-3.4" y="11" transform="matrix(0.7071 0.7071 -0.7071 0.7071 13 -5.3848)" class="st0" width="32.7" height="4" />
            <rect x="-3.4" y="11" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -5.3848 13)" class="st0" width="32.7" height="4" />
          </svg>
        </div>
        <img/>
      </div>
    </div>
  </div>
`;
const $body = $(document.body);

class LightboxImage {
  constructor(lightbox, src, id) {
    this.lightbox = lightbox;
    this.src = src;
    this.id = id;
    this.$view = $(LIGHTBOX_TEMPLATE).hide();
  }

  loadImage($loadedImg) {
    let top;

    $body.removeClass('lightbox-loading');
    $body.append(this.$view);
    this.$view.fadeIn(FADE_TIME);

    if (this.lightbox.$activeImage) {
      this.lightbox.$activeImage.fadeOut(FADE_TIME, () => {
        this.lightbox.$activeImage.remove();
        this.lightbox.$activeImage = this.$view;
        this.lightbox.isLoading = false;
      });
    }
    else {
      this.lightbox.$activeImage = this.$view;
      this.lightbox.isLoading = false;
    }

    this.lightbox.activeImageId = this.id;
    if ($loadedImg.height()) {
      top = ($(window).height() - $loadedImg.height()) / 2;
      this.$view.addClass('shown');
      this.$view.css('top', top);
      this.$view.find('.js-img-wrap').height($loadedImg.height());
    }

    this._setCloseIconColor(this.$view, this.lightbox.bgColor);
  }

  render() {
    if (this.lightbox.isLoading) {
      return;
    }

    var $img = this.$view.find('img');
    this.lightbox.isLoading = true;

    $body.addClass('lightbox-active lightbox-loading');

    if (this.lightbox.isSingle) {
      this.$view.addClass('single');
    }

    if (this.lightbox.activeImageId === false) {
      this.lightbox.bind();
      this.lightbox.$blocking.css({
        backgroundColor: this.lightbox.bgColor,
        opacity: this.lightbox.opacity
      });
      $body.append(this.lightbox.$blocking);
    }

    $img.attr('src', this.src);
    // because IOS doesnt fire load for cached images,
    // but luckily this will be true immediately if that is the case
    if ($img[0].complete) {
      this.loadImage($img);
    }
    else {
      $img.on('load', () => {
        this.loadImage($img);
      });
    }
  }

  _setCloseIconColor($context, bgColor) {
    var tinyBgColor = tinycolor(bgColor);
    var closeIconColor = tinyBgColor.isLight() ? '#000' : '#FFF';
    var $svg = $context.find('.js-close svg');

    if($svg.attr('fill')) {
      return;
    }

    $svg.attr('fill', closeIconColor);
  }
};

class Lightbox {
  constructor(options) {
    const config = $.extend({
      context: document.body,
      imageSelector: '.js-lightbox',
      imageSrcDataAttr: 'src',
      bgColor: '#fff',
      opacity: '0.94'
    }, options);

    this.$blocking = $(BACKDROP_TEMPLATE);
    this.images = [];
    this.activeImageId = false;
    this.isLoading = false;
    this.isSingle = false;
    this.$context = $(config.context);
    this.bgColor = config.bgColor;
    this.opacity = config.opacity;

    this.$context.find(config.imageSelector).each((i, el) => {
      const $img = $(el);
      $img.data('img-id', i).addClass('lightbox-link');
      this.images[i] = new LightboxImage(this, $img.data(config.imageSrcDataAttr), i);
    });

    const self = this;
    this.$context.find(`:not(a) > ${config.imageSelector}`).on('click', function (e) {
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

    $body.add(this.$context).off('click.lightbox');
    this.$activeImage.fadeOut(FADE_TIME, () => {
      this.$activeImage.remove();
      this.$activeImage = null;
      $body.find(this.$blocking).remove();
      $body.removeClass('lightbox-active');
      this.activeImageId = false;
    });
  }

  next() {
    this.images[(this.images[this.activeImageId+1]) ? this.activeImageId+1 : 0].render();
  }

  prev() {
    this.images[(this.images[this.activeImageId-1]) ? this.activeImageId-1 : this.images.length-1].render();
  }

  bind() {
    $body.on('click.lightbox', () => {
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
  }
}

export default {
  init: (options) => new Lightbox(options)
};
