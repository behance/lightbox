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
const OFFSCREEN_CLASS = 'offscreen';
const TRANSITION_END = 'webkitTransitionEnd ontransitionend msTransitionEnd transitionend';
const JS_SLIDE_CLASS = 'js-slide';
const JS_SLIDE_CONTENT_CLASS = 'js-slide-content';

export default class ChromeView {
  constructor($context, controller, props) {
    this._$context = $context;
    this._controller = controller;
    this._props = props;
    this._$view = $(lightboxTemplate).appendTo($context);
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

    this._$view.removeClass(OFFSCREEN_CLASS);
  }

  renderSlide(slide) {
    this._maybeHidePrevNext();
    this._appendSlide(slide);

    const $current = this._$contents.find(`.${JS_SLIDE_CLASS}[data-slide-is-active]`);
    const $new = this._$contents.find(`.${JS_SLIDE_CLASS}[data-slide-id="${slide.id}"]`);

    $current
      .removeAttr('data-slide-is-active')
      .find(`> .${JS_SLIDE_CONTENT_CLASS}`)
      .addClass(HIDDEN_CLASS)
      .one(TRANSITION_END, () => $current.remove());

    $new
      .attr({ 'data-slide-is-active': true })
      .removeClass(OFFSCREEN_CLASS)
      .find(`> .${JS_SLIDE_CONTENT_CLASS}`)
      .removeClass(HIDDEN_CLASS);

    this._appendAdjacentSlides($current, $new);
  }

  close() {
    this._$view.addClass(OFFSCREEN_CLASS);
    this._$contents.empty();

    $(document)
      .add(this._$context)
      .off('.lightbox');

    $('html').removeClass(ENABLED_CLASS);

    if (this._idleTimer) {
      this._idleTimer.destroy();
    }
  }

  destroy() {
    this._$view.remove();
  }

  hideExtras() {
    this._$view.addClass(EXTRAS_HIDDEN_CLASS);
  }

  showExtras() {
    this._$view.removeClass(EXTRAS_HIDDEN_CLASS);
  }

  _appendSlide(slide) {
    if (!slide || this._$contents.find(`[data-slide-id="${slide.id}"]`).length) { return; }

    const $content = $('<div>')
      .addClass(`${JS_SLIDE_CONTENT_CLASS} ${CONTENT_CLASS} ${HIDDEN_CLASS}`)
      .html(this._getSlideContent(slide));

    $('<div>', { 'data-slide-id': slide.id, class: `${JS_SLIDE_CLASS} ${OFFSCREEN_CLASS}` })
      .append($content)
      .appendTo(this._$contents);
  }

  _appendAdjacentSlides($current, $new) {
    if ($current.length === 0) {
      this._appendSlide(this._controller.getPrevSlide());
      this._appendSlide(this._controller.getNextSlide());
    }
    else {
      this._appendSlide($current.data('slide-id') < $new.data('slide-id')
        ? this._controller.getNextSlide()
        : this._controller.getPrevSlide());
    }
  }

  _bindToController() {
    this._controller.on({
      open: slide => { this.init(); this.renderSlide(slide); },
      close: () => this.close(),
      destroy: () => this.destroy(),
      activate: slide => this.renderSlide(slide),
      prefetch: slide => this._appendSlide(slide)
    });
  }

  _getSlideContent(slide) {
    const { src } = slide;
    return src ? $('<img />', { src }) : slide.content;
  }

  _maybeHidePrevNext() {
    const hasPrev = this._controller.getPrevSlide();
    const hasNext = this._controller.getNextSlide();
    if (this._props.isCircular && (hasPrev || hasNext)) { return; }
    (hasPrev) ? this._$prev.removeClass(HIDDEN_CLASS) : this._$prev.addClass(HIDDEN_CLASS);
    (hasNext) ? this._$next.removeClass(HIDDEN_CLASS) : this._$next.addClass(HIDDEN_CLASS);
  }
}
