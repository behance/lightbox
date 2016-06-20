import $ from 'jquery';
import tinycolor from 'tinycolor2';
import 'style!./sass/lightbox.scss';

var bgColor,
    opacity,
    $blocking = $('<div class="js-blocking" id="lightbox-blocking"></div>'),
    $body = $(document.body),
    template = `
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
    `,
    images = [],
    active = false,
    loading = false,
    FADE_TIME = 200,
    single = false,
    $context,
    $activeImage;

var LightboxImage = function(src, id) {
  this.src = src;
  this.id = id;
  this.$view = $(template).hide();

  var self = this;

  this.imgLoad = function($loadedImg) {
    var top;

    $body.removeClass('lightbox-loading');

    $body.append(self.$view);

    self.$view.fadeIn(FADE_TIME);

    if ($activeImage) {
      $activeImage.fadeOut(FADE_TIME, function() {
        $activeImage.remove();
        $activeImage = self.$view;
        loading = false;
      });
    }
    else {
      $activeImage = self.$view;
      loading = false;
    }

    active = self.id;
    if ($loadedImg.height()) {
      top = ($(window).height() - $loadedImg.height()) / 2;
      self.$view.addClass('shown');
      self.$view.css('top', top);
      self.$view.find('.js-img-wrap').height($loadedImg.height());
    }

    _setCloseIconColor(self.$view, bgColor);
  };

  this.render = function() {
    if (loading) {
      return;
    }

    var $img = this.$view.find('img');
    loading = true;

    $body.addClass('lightbox-active lightbox-loading');

    if (single) {
      this.$view.addClass('single');
    }

    if (active === false) {
      bind();
      $blocking.css({
        backgroundColor: bgColor,
        opacity: opacity
      });
      $body.append($blocking);
    }

    $img.attr('src', this.src);
    // because IOS doesnt fire load for cached images,
    // but luckily this will be true immediately if that is the case
    if ($img[0].complete) {
      this.imgLoad($img);
    }
    else {
      $img.on('load', function() {
        this.imgLoad($img);
      }.bind(this));
    }
  };
};

function close() {
  if (loading || active === false) {
    return;
  }

  $body.add($context).off('click.lightbox');
  $activeImage.fadeOut(FADE_TIME, function() {
    $activeImage.remove();
    $activeImage = null;
    $body.find($blocking).remove();
    $body.removeClass('lightbox-active');
    active = false;
  });
}

function next() {
  images[(images[active+1]) ? active+1 : 0].render();
}

function prev() {
  images[(images[active-1]) ? active-1 : images.length-1].render();
}

function bind() {
  $body.on('click.lightbox', function() {
    close();
  });

  $(document).on('keyup.lightbox', function(e) {
    if (e.keyCode === 27) { // escape
      close();
    }
  });

  if (single) {
    return;
  }

  $context.on('click.lightbox', '.js-next', function(e) {
    e.stopPropagation();
    next();
  });

  $context.on('click.lightbox', '.js-prev', function(e) {
    e.stopPropagation();
    prev();
  });

  $(document).on('keyup.lightbox', function(e) {
    if (e.keyCode === 37) { // left arrow
      prev();
    }
    else if (e.keyCode === 39) { // right arrow
      next();
    }
  });
}

function _setCloseIconColor($context, bgColor) {
  var tinyBgColor = tinycolor(bgColor);
  var closeIconColor = tinyBgColor.isLight() ? '#000' : '#FFF';
  var $svg = $context.find('.js-close svg');

  if($svg.attr('fill')) {
    return;
  }

  $svg.attr('fill', closeIconColor);
}

function init(options) {
  var defaults = {
    context: document.body,
    bgColor: '#fff',
    opacity: '0.94'
  };
  var config = $.extend(defaults, options);

  $context = $(config.context);
  bgColor = config.bgColor;
  opacity = config.opacity;

  $context.find('.js-lightbox').each(function(i, el) {
    var $img = $(el);
    $img.data('img-id', i).addClass('lightbox-link');
    images[i] = new LightboxImage($img.data('src'), i);
  });

  $context.find(':not(a) > .js-lightbox').on('click', function(e) {
    e.stopPropagation();
    images[$(this).data('img-id')].render();
  });

  if (images.length === 1) {
    single = true;
  }
}

export default {
  init: init
};
