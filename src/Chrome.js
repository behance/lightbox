import $ from 'jquery';
import idleTimer from 'idle-timer';
import tinycolor from 'tinycolor2';
import { lightbox as lightboxTemplate } from './templates';

const ESCAPE_KEYCODE = 27;
const LEFT_ARROW_KEYCODE = 37;
const RIGHT_ARROW_KEYCODE = 39;
const EXTRAS_HIDDEN_CLASS = 'extras-hidden';

export default class Chrome {
  constructor(props) {
    this._props = props;
    this._$view = $(lightboxTemplate);
    this._$contents = this._$view.find('.js-contents');
  }

  init() {
    const act = (name, event) => {
      event.stopPropagation();
      this._props[`on${name}`]();
    };

    this._props.$context
      .on('click.lightbox', '.js-next', (e) => act('next', e))
      .on('click.lightbox', '.js-prev', (e) => act('prev', e))
      .on('click.lightbox', (e) => act('close', e));

    $(document).on('keyup.lightbox', (e) => {
      switch (e.keyCode) {
        case LEFT_ARROW_KEYCODE: act('prev', e); break;
        case RIGHT_ARROW_KEYCODE: act('next', e); break;
        case ESCAPE_KEYCODE: act('close', e); break;
      }
    });

    this._idleTimer = idleTimer({
      callback: () => this.hideExtras(),
      activeCallback: () => this.showExtras(),
      idleTime: this._props.idleTimeInMs
    });

    this._$view
      .find('.js-blocking')
      .css({
        backgroundColor: this._props.bgColor,
        opacity: this._props.opacity
      });

    this._$view
      .find('.js-close svg')
      .attr('fill', tinycolor(this._props.bgColor)
        .isLight() ? '#000' : '#FFF');

    this._props.$context.append(this._$view);
  }

  renderSlide(slide) {
    const picture = slide.$node.data('picture');
    const src = slide.$node.data(this._props.imageSrcDataAttr);
    let $content;

    if (picture) {
      $content = $('<picture />');
      picture.sources.forEach(({ srcset, media_query: media }) => {
        $('<source />', { srcset, media }).appendTo($content);
      });
      const { src, alt } = picture.img;
      $('<img />', { src, alt }).appendTo($content);
    }
    else {
      $content = $('<img />', { src: src });
    }

    this._$contents.empty().append($content);
  }

  destroy() {
    this._$view.remove();

    $(document)
      .add(this._props.$context)
      .off('.lightbox');

    if (this._idleTimer) {
      this._idleTimer.destroy();
    }
  }

  hideExtras() {
    this._$view.addClass(EXTRAS_HIDDEN_CLASS);
  }

  showExtras() {
    this._$view.removeClass(EXTRAS_HIDDEN_CLASS);
  }
}
