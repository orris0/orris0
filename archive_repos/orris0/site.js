// responsive menu
$(".menu-btn").click(function(){
  $(".menu-btn").toggleClass("hide-menu");
  $("nav").toggleClass("show-nav");
  $("body").toggleClass("move-body");
  $("header").toggleClass("header-bg");
  $("header").toggleClass("overflow-reset");
  $(".page header").toggleClass("open-header");
  $(".page main").toggleClass("push-down");

  return false;
});


// more-wine info

$(".more-wine-info").click(function(){
  $(this).parent().parent().toggleClass("show-wine");
  $(this).parent().parent().toggleClass("wine-more-info");
  $(this).parent().toggleClass("more-wine-details");
  $(this).parent().toggleClass("more-wine-details");
  $(this).parent().parent().next().toggleClass("space-filler");
  return false;
});
$(".close").click(function(){
  $(".wine-more-info").removeClass("show-wine");
  $(this).parent().parent().removeClass("show-wine");
  $(this).parent().parent().removeClass("wine-more-info");
  $(this).parent().removeClass("wine-more-info");
  $(this).parent().removeClass("more-wine-details");
  $(this).parent().removeClass("more-wine-details");
  return false;
});


// resize the 'page' height
var $window = $(window),
$inner = $('.inner');

var resize = function () {
  var winHeight = $window.height();
// This is the window's height, not *screen* – is that what you mean?
$inner.css({

  'height': (winHeight > 760 ? winHeight : '780px')
});
};

// Call resize when document is ready
$(resize);
$window.on('resize', resize);




// scrolls down the home page w/ height being calculated depending where you are
$('.down-arrow').click(
  function (e) {
    var $elem= $(this).closest('.inner');

    $('html, body').animate({scrollTop: $elem.offset().top+$elem.height()}, 250);
  }
  );

// adds the transparent black background onto the home page when a user hovers over the content div
$(function() {
  $('.full-page .inner').hover( function(){
    $(this).parent().addClass("black");
  },
  function(){
    $(this).parent().removeClass("black");
  });
});



// show/hide stockist list

$(".county-name").click(function(){
  $(".county-name").not(this).next(".shops-in-county-list").slideUp("slow");
  $(this).next(".shops-in-county-list").slideToggle("slow");
  $(".county-name").not(this).removeClass("change-icon");
  $(this).toggleClass('change-icon');
  return false;
});


// backstretch calls


$(".first-page:first-child").anystretch("../wp-content/themes/starkers-master/img/backgrounds/homepage/bg01-1400.jpg");
$(".first-page:first-child + section").anystretch("../wp-content/themes/starkers-master/img/backgrounds/homepage/bg02-1400.jpg");
$(".first-page:first-child + section + section").anystretch("../wp-content/themes/starkers-master/img/backgrounds/homepage/bg03-1400.jpg");
$(".first-page:first-child + section + section + section").anystretch("../wp-content/themes/starkers-master/img/backgrounds/homepage/bg04-1400.jpg");
$(".first-page:first-child + section + section + section + section").anystretch("../wp-content/themes/starkers-master/img/backgrounds/homepage/bg05-1400.jpg");


// add header background on hover

$(window).scroll(function() {
  var scroll = $(window).scrollTop();

  if (scroll >= 100) {
    $("header").addClass("darkHeader");
  } else {
    $("header").removeClass("darkHeader");
  }
});

// plaeholder IE replacement

$('input, textarea').placeholder();
