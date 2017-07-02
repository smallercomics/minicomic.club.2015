// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};


(function($){
  var $header_img = $('header img');
  var $header_small = $('#small_header');

	function on_scroll(){
		console.log($(window).scrollTop());
			if ($(window).scrollTop() > $header_img.height()){
				$header_small.addClass('visible');
			}else{
				$header_small.removeClass('visible');
			}

		}

  $(window).scroll( debounce(on_scroll, 100, false));

  $('.fb-link').click(function(e){
		e.preventDefault();
		FB.ui({
				method: 'share',
				href: window.location.href,
		}, function(response){});
	});

})(jQuery)