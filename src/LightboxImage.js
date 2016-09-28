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
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <circle class="lightbox-icon-bg" cx="50" cy="50" r="47.5"/>
            <polygon class="lightbox-icon-close" points="64.5,39.8 60.2,35.5 50,45.7 39.8,35.5 35.5,39.8 45.7,50 35.5,60.2 39.8,64.5 50,54.3 60.2,64.5 64.5,60.2 54.3,50"/>
          </svg>
        </div>
        <div class="lightbox-contents js-contents"></div>
      </div>
    </div>
  </div>
`;
const EXTRAS_HIDDEN_CLASS = 'extras-hidden';

export default class LightboxImage {
  constructor(lightbox, src, id) {
    this.lightbox = lightbox;
    this.src = src;
    this.id = id;
    this.$view = $(LIGHTBOX_TEMPLATE).hide();
  }

  appendWrap() {
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
    this._setCloseIconColor(this.$view, this.lightbox.bgColor);
    this.$view.addClass('shown');
  }

  showExtras() {
    this.$view.removeClass(EXTRAS_HIDDEN_CLASS);
  }

  hideExtras() {
    this.$view.addClass(EXTRAS_HIDDEN_CLASS);
  }

  render() {
    if (this.lightbox.isLoading) {
      return;
    }

    const $contents = this.$view.find('.js-contents');
    const isSrcPicture = (typeof this.src === 'object');

    this.lightbox.isLoading = true;

    $('html').addClass('lightbox-active');

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

    $contents.empty();

    if (isSrcPicture) {
      const $picture = $('<picture />');

      this.src.sources.forEach(({ srcset, media_query: media }) => {
        $('<source />', { srcset, media }).appendTo($picture);
      });

      const { src, alt } = this.src.img;
      $('<img />', { src, alt }).appendTo($picture);

      $picture.appendTo($contents);
    }
    else {
      $('<img />', { src: this.src }).appendTo($contents);
    }

    this.appendWrap();
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
