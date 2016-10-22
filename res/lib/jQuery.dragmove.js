// Plugin: jQuery.dragmove
// Source: github.com/nathco/jQuery.dragmove
// Author: Nathan Rutzky
// Update: 1.0
(function($) {
  $.fn.dragmove = function(options) {
    return this.each(function(index0) {
      var $document = $(document),
        $this = $(this),
        active,
        startX,
        startY;
      $this.on('mousedown touchstart', function(e) {
        if (!active && options.onstart) options.onstart(index0, e);

        active = true;
        startX = e.originalEvent.pageX - $this.offset().left;
        startY = e.originalEvent.pageY - $this.offset().top;
        if ('mousedown' == e.type)
          click = $this;
        if ('touchstart' == e.type)
          touch = $this;
        if (window.mozInnerScreenX == null)
          return false;
      });

      $document.on('mousemove touchmove', function(e) {
        if (active && options.onmove) options.onmove(index0, e);

        if ('mousemove' == e.type && active)
          click.offset({
          left: e.originalEvent.pageX - startX,
          top: e.originalEvent.pageY - startY
        });
        if ('touchmove' == e.type && active)
          touch.offset({
          left: e.originalEvent.pageX - startX,
          top: e.originalEvent.pageY - startY
        });
      }).on('mouseup touchend', function(e) {
        if (active && options.onend) options.onend(index0, e);
        active = false;
      });
    });
  };
})(jQuery);