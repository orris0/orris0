// onScreen jQuery plugin v0.2.1
// (c) 2011-2013 Ben Pickles
//
// http://benpickles.github.io/onScreen
//
// Released under MIT license.
;(function($) {
	$.expr[":"].iframeElementOnScreen = function (elem) {
		/*
		 var $window = $(window);
		 var viewport_height = $window.height();
		 var rect = $(elem)[0].getBoundingClientRect();
		 return (rect.top >= 0 && rect.top < viewport_height) ||
		 (rect.bottom > 0 && rect.bottom <= viewport_height) ||
		 (rect.height > viewport_height && rect.top <= 0 && rect.bottom >= viewport_height);
		 */
		var $window = $(window)
		var viewport_top = $window.scrollTop() + $("#video").scrollTop()
		var viewport_height = $window.height()
		var viewport_bottom = viewport_top + viewport_height
		var $elem = $(elem)
		var top = $elem.offset().top
		var height = $elem.height()
		var bottom = top + height

		return (top >= viewport_top && top < viewport_bottom) ||
		(bottom > viewport_top && bottom <= viewport_bottom) ||
		(height > viewport_height && top <= viewport_top && bottom >= viewport_bottom)
	};

	$.expr[":"].onScreen = function (elem) {
		var $window = $(window)
		var viewport_top = $window.scrollTop()
		var viewport_height = $window.height()
		var viewport_bottom = viewport_top + viewport_height
		var $elem = $(elem)
		var top = $elem.offset().top
		var height = $elem.height()
		var bottom = top + height

		return (top >= viewport_top && top < viewport_bottom) ||
			(bottom > viewport_top && bottom <= viewport_bottom) ||
			(height > viewport_height && top <= viewport_top && bottom >= viewport_bottom)
	}
})(jQuery);
