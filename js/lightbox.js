$(function() {
  var $blocking = $('<div class="js-blocking" id="lightbox-blocking"></div>'),
      $body = $(document.body),
      template = '<div class="js-lightbox-wrap" id="lightbox-wrap"> <div class="js-lightbox-inner-wrap" id="lightbox-inner-wrap"> <span class="js-img-wrap" id="img-wrap"> <div class="control prev js-control js-prev"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" viewBox="0 0 10 10" xml:space="preserve"><path d="M4.4 5l3.3-3.3C7.9 1.5 8 1.3 8 1c0-0.3-0.1-0.5-0.3-0.7 -0.4-0.4-1-0.4-1.4 0l-4 4C2.1 4.5 2 4.7 2 5s0.1 0.5 0.3 0.7l4 4c0.4 0.4 1 0.4 1.4 0C7.9 9.5 8 9.3 8 9c0-0.3-0.1-0.5-0.3-0.7L4.4 5z"/></svg> </div> <div class="control next js-control js-next"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" viewBox="0 0 10 10" xml:space="preserve"><path d="M5.6 5L2.3 8.3C2.1 8.5 2 8.7 2 9c0 0.3 0.1 0.5 0.3 0.7 0.4 0.4 1 0.4 1.4 0l4-4C7.9 5.5 8 5.3 8 5S7.9 4.5 7.7 4.3l-4-4c-0.4-0.4-1-0.4-1.4 0C2.1 0.5 2 0.7 2 1c0 0.3 0.1 0.5 0.3 0.7L5.6 5z"/></svg> </div> <div class="control close js-control js-close"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" viewBox="0 0 26 26" xml:space="preserve"><rect x="-3.4" y="11" transform="matrix(0.7071 0.7071 -0.7071 0.7071 13 -5.3848)" class="st0" width="32.7" height="4"/><rect x="-3.4" y="11" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -5.3848 13)" class="st0" width="32.7" height="4"/></svg></div> <img/></span> </div> </div>',
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
        $body.addClass('lightbox-active');
      }

      // show loading spinner here?

      $img.load(function() {
        var top;

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
        self.$tmpl.find('#img-wrap').height(this.height);
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
      $img.data('img-id', i);
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