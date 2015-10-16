$(function() {
  var $blocking = $('<div class="js-blocking" id="lightbox-blocking"></div>'),
      $body = $(document.body),
      template = '<div class="js-lightbox-wrap" id="lightbox-wrap"> <div class="js-lightbox-inner-wrap" id="lightbox-inner-wrap"> <div class="js-img-wrap" id="lightbox-img-wrap"> <div class="control prev js-control js-prev"> <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" width="60" height="60" viewBox="0 0 60 60" xml:space="preserve"><circle class="lightbox-icon-bg" cx="30" cy="30" r="30"/><path class="lightbox-icon-arrow" d="M28.6 30l7.9-7.9c0.5-0.5 0.7-1.1 0.7-1.7s-0.2-1.2-0.7-1.7c-0.9-0.9-2.5-0.9-3.4 0l-9.6 9.6c-0.5 0.5-0.7 1.1-0.7 1.7s0.2 1.2 0.7 1.7l9.6 9.6c0.9 0.9 2.5 0.9 3.4 0 0.5-0.5 0.7-1.1 0.7-1.7 0-0.6-0.2-1.2-0.7-1.7L28.6 30z"/></svg> </div> <div class="control next js-control js-next"> <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" width="60" height="60" viewBox="0 0 60 60" xml:space="preserve"><circle class="lightbox-icon-bg" cx="30" cy="30" r="30"/><path class="lightbox-icon-arrow" d="M31.4 30l-7.9 7.9c-0.5 0.5-0.7 1.1-0.7 1.7 0 0.6 0.2 1.2 0.7 1.7 0.9 0.9 2.5 0.9 3.4 0l9.6-9.6c0.5-0.5 0.7-1.1 0.7-1.7s-0.2-1.2-0.7-1.7l-9.6-9.6c-0.9-0.9-2.5-0.9-3.4 0 -0.5 0.5-0.7 1.1-0.7 1.7 0 0.6 0.2 1.2 0.7 1.7L31.4 30z"/></svg> </div> <div class="control close js-control js-close"> <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" viewBox="0 0 26 26" preserveAspectRatio="xMidYMid meet"> <rect x="-3.4" y="11" transform="matrix(0.7071 0.7071 -0.7071 0.7071 13 -5.3848)" class="st0" width="32.7" height="4" /> <rect x="-3.4" y="11" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -5.3848 13)" class="st0" width="32.7" height="4" /> </svg> </div> <img/></div> </div> </div>',
      images = [],
      active = false,
      loading = false,
      $context,
      $activeImage;

  var LightboxImage = function(src, id) {
    this.src = src;
    this.id = id;
    this.$tmpl = $(template);

    this.render = function() {
      var self = this,
          $img = this.$tmpl.find('img');

      $img.attr('src', this.src);

      loading = true;

      if (active === false) {
        bind();
        $body.append($blocking);
        $body.addClass('lightbox-active lightbox-loading');
      }

      // show loading spinner here?

      $img.load(function() {
        var top;

        $body.removeClass('lightbox-loading');

        if ($activeImage) {
          $activeImage.replaceWith(self.$tmpl);
        }
        else {
          $context.append(self.$tmpl);
        }

        $activeImage = self.$tmpl;
        active = self.id;

        top = ($(window).height() / 2) - (this.height / 2);

        self.$tmpl.css('top', top);
        self.$tmpl.find('.js-img-wrap').height(this.height);
        self.$tmpl.addClass('shown');
        loading = false;
      });
    };
  };

  function close() {
    $activeImage.remove();
    $activeImage = null;
    $body.find($blocking).remove();
    $body.removeClass('lightbox-active');
    active = false;
    $body.add($context).off('click.lightbox');
  }

  function next() {
    images[(images[active+1]) ? active+1 : 0].render();
  }

  function prev() {
    images[(images[active-1]) ? active-1 : images.length-1].render();
  }

  function bind() {
    $body.on('click.lightbox', function() {
      if (active !== false) {
        close();
      }
    });

    $context.on('click.lightbox', '.js-next', function(e) {
      e.stopPropagation();
      next();
    });

    $context.on('click.lightbox', '.js-prev', function(e) {
      e.stopPropagation();
      prev();
    });

    $(document).keyup(function(e) {
      if (active !== false && loading === false) {
        switch(e.keyCode) {
          case 27: // escape
            close();
            break;
          case 37: // left arrow
            prev();
            break;
          case 39: // right arrow
            next();
            break;
        }
      }
    });
  }

  function init(context) {
    $context = $(context || document.body);

    $('.js-lightbox').each(function(i, el) {
      var $img = $(el);
      $img.data('img-id', i).addClass('lightbox-link');
      images[i] = new LightboxImage($img.data('src'), i);
    });

    $('.js-lightbox').on('click', function() {
      images[$(this).data('img-id')].render();
    });
  }

  window.lightbox = {
    init: init
  };
});