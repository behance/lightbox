import $ from 'jquery';
import tinycolor from 'tinycolor2';

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

export default class LightboxImage {
  constructor(lightbox, src, id) {
    this.lightbox = lightbox;
    this.src = src;
    this.id = id;
    this.$view = $(LIGHTBOX_TEMPLATE).hide();
  }

  loadImage($loadedImg) {
    let top;

    this.lightbox.$body.removeClass('lightbox-loading');
    this.lightbox.$body.append(this.$view);
    this.$view.fadeIn(this.lightbox.fadeTimeInMs);

    if (this.lightbox.$activeImage) {
      this.lightbox.$activeImage.fadeOut(this.lightbox.fadeTimeInMs, () => {
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

    const $img = this.$view.find('img');
    this.lightbox.isLoading = true;

    this.lightbox.$body.addClass('lightbox-active lightbox-loading');

    if (this.lightbox.isSingle) {
      this.$view.addClass('single');
    }

    if (this.lightbox.activeImageId === false) {
      this.lightbox.bind();
      this.lightbox.$blocking.css({
        backgroundColor: this.lightbox.bgColor,
        opacity: this.lightbox.opacity
      });
      this.lightbox.$body.append(this.lightbox.$blocking);
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
    const tinyBgColor = tinycolor(bgColor);
    const closeIconColor = tinyBgColor.isLight() ? '#000' : '#FFF';
    const $svg = $context.find('.js-close svg');

    if ($svg.attr('fill')) {
      return;
    }

    $svg.attr('fill', closeIconColor);
  }
}
