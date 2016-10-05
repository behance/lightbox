import 'style!../sass/lightbox.scss';
import $ from 'jquery';
import idleTimer from 'idle-timer';
import tinycolor from 'tinycolor2';
import { lightbox as lightboxTemplate } from './templates';

const ESCAPE_KEYCODE = 27;
const LEFT_ARROW_KEYCODE = 37;
const RIGHT_ARROW_KEYCODE = 39;
const EXTRAS_HIDDEN_CLASS = 'extras-hidden';
const CONTENT_CLASS = 'lightbox-content';
const ENABLED_CLASS = 'lightbox-enabled';
const HIDDEN_CLASS = 'hidden';

export default class ChromeView {
  constructor($context, controller, props) {
    this._$context = $context;
    this._controller = controller;
    this._props = props;
    this._$view = $(lightboxTemplate);
    this._$contents = this._$view.find('.js-contents');
    this._$prev = this._$view.find('.js-prev');
    this._$next = this._$view.find('.js-next');
    this._bindToController();
  }

  init() {
    const act = (name, event) => {
      event.stopImmediatePropagation();
      this._controller[name]();
    };

    this._idleTimer = idleTimer({
      callback: () => this.hideExtras(),
      activeCallback: () => this.showExtras(),
      idleTime: this._props.idleTimeInMs
    });

    this._$context
      .on('click.lightbox', '.js-next', (e) => act('next', e))
      .on('click.lightbox', '.js-prev', (e) => act('prev', e))
      .on('click.lightbox', (e) => act('close', e));

    $(document)
      .on('mouseout.lightbox', () => this._idleTimer.idle())
      .on('keydown.lightbox', (e) => {
        switch (e.keyCode) {
          case LEFT_ARROW_KEYCODE:
            this._idleTimer.idle();
            act('prev', e);
            break;
          case RIGHT_ARROW_KEYCODE:
            this._idleTimer.idle();
            act('next', e);
            break;
          case ESCAPE_KEYCODE: act('close', e); break;
        }
      });

    $('html').addClass(ENABLED_CLASS);

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

    this.showExtras();

    this._$context.append(this._$view);
  }

  renderSlide(slide) {
    this._maybeHidePrevNext(slide);

    const $next = $(`<div class="${CONTENT_CLASS} ${HIDDEN_CLASS}">`);
    $next.html(this._getSlideContent(slide));

    this._$contents.find(`.${HIDDEN_CLASS}`).remove();
    this._$contents.append($next);

    this._$contents.find(`.${CONTENT_CLASS}:lt(1)`).addClass(HIDDEN_CLASS);
    setTimeout(() => $next.removeClass(HIDDEN_CLASS), 0);
  }

  destroy() {
    this._$view.remove();

    $(document)
      .add(this._$context)
      .off('.lightbox');

    $('html').removeClass(ENABLED_CLASS);

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

  _bindToController() {
    this._controller.on({
      open: slide => { this.init(); this.renderSlide(slide); },
      close: () => this.destroy(),
      prev: slide => this.renderSlide(slide),
      next: slide => this.renderSlide(slide)
    });
  }

  _getSlideContent(slide) {
    const { src } = slide;
    return src ? $('<img />', { src }) : slide.content;
  }

  _maybeHidePrevNext(activeSlide) {
    const hasPrev = this._controller.slides[activeSlide.id - 1];
    const hasNext = this._controller.slides[activeSlide.id + 1];
    if (this._props.isCircular && (hasPrev || hasNext)) { return; }
    (hasPrev) ? this._$prev.removeClass(HIDDEN_CLASS) : this._$prev.addClass(HIDDEN_CLASS);
    (hasNext) ? this._$next.removeClass(HIDDEN_CLASS) : this._$next.addClass(HIDDEN_CLASS);
  }
}
