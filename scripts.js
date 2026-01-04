// Example 3-1. Requesting a filesystem temporary storage
var onError = function(fs) {
console.log('There was an error');
};
var onFS = function(fs) {
console.log('Opened filesystem: ' + fs.name);
};
window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, onFs, onError);







// chapter_04/15_iphoto_style_slideshow/script.js
$(document).ready(function(){
  gallery.trigger = $("#photos .trigger");
  gallery.content = $("#photos_inner");
  gallery.scroll = false;
  gallery.width = 400;
  gallery.innerWidth = gallery.content.width();
  gallery.timer = false;
  gallery.init();
});

gallery = {};

gallery.offset = function() {
  var left = gallery.content.position().left;
  
	if (gallery.scroll == '>') {
    if (left < 0) {
      left += gallery.width;
    }
  }
  else {
    if (left <= 0 && left >= ((gallery.innerWidth * -1) + (gallery.width * 2))) {
      left -= gallery.width;
    }
  }
  return left + "px";
}

gallery.slide = function() {
  
	if (gallery.timer) {
    clearTimeout(gallery.timer);
  }
  if (gallery.scroll) {
    $(gallery.content).stop(true,true).animate({left: gallery.offset()}, 500);
    gallery.timer = setTimeout(gallery.slide, 1000)
  }
}

gallery.direction = function(e,which) {
  var x = e.pageX - which.offset().left;
  gallery.scroll = (x >= gallery.width / 2) ? ">" : "<";
}

gallery.init = function() {
  $(gallery.trigger)
    .mouseout(function() {gallery.scroll = false;})
    .mousemove(function(e) {gallery.direction(e,gallery.trigger);})
    .mouseover(function(e) {
      gallery.direction(e,gallery.trigger);
      gallery.slide();
    });
}


// chapter_04/11_thumbnail_scroller/script.js
$(document).ready(function() {
	$('#photos_inner').toggle(function() {
		var scrollAmount = $(this).width() - $(this).parent().width();
		$(this).animate({'left':'-=' + scrollAmount}, 'slow');
	}, function() {
		$(this).animate({'left':'0'}, 'slow');
	});
});

// chapter_04/10_cycle_plugin_2/script.js
$(document).ready(function(){
  $('#photos').cycle({
    fx: 'scrollDown',
    speedIn: 2500,
    speedOut: 500,
    timeout: 0,
    next: '#photos'
  });
});


// chapter_04/09_cycle_plugin/script.js
$(document).ready(function(){
  $('#photos').cycle({
    fx: 'shuffle'
  });
});



// thumb nail
$(document).ready(function() {
	$('#photos_inner').toggle(function() {
		var scrollAmount = $(this).width() - $(this).parent().width();
		$(this).animate({'left':'-=' + scrollAmount}, 'slow');
	}, function() {
		$(this).animate({'left':'0'}, 'slow');
	});
});

// shuffle
$(document).ready(function(){
  $('#photos').cycle({
    fx: 'shuffle'
  });
});


// inner fade
$(document).ready(function() {
  $('#news ul').innerfade({
    animationtype: 'slide',
    speed: 750,
    timeout: 3000,
    type: 'random'
  });
});

// slideshow cross fade
$(document).ready(function() {
  rotatePics(1);
});

function rotatePics(currentPhoto) {
  var numberOfPhotos = $('#photos img').length;
  currentPhoto = currentPhoto % numberOfPhotos;
	
  $('#photos img').eq(currentPhoto).fadeOut(function() {
    // re-order the z-index
    $('#photos img').each(function(i) {
      $(this).css(
        'zIndex', ((numberOfPhotos - i) + currentPhoto) % numberOfPhotos
      );
    });
    $(this).show();
    setTimeout(function() {rotatePics(++currentPhoto);}, 4000);
  });
}


// slideshow fade
$(document).ready(function(){
  slideShow();
});

function slideShow() {
  var current = $('#photos .show');
  var next = current.next().length ? current.next() : current.siblings().first();
  
  current.hide().removeClass('show');
  next.fadeIn().addClass('show');
  
  setTimeout(slideShow, 3000);
}

// timers 
$(document).ready(function() {
  // move the green box with setInterval
  var $green = $('#green');
    greenLeft = $green.offset().left;
  setInterval(function() {
    $green.css('left', ++greenLeft);
  }, 200);

    
  // move the red box with setTimeout
  var $red = $('#red'),
    redLeft = $('#red').offset().left;
  function moveRed() {
    $red.css('left', ++redLeft);
    setTimeout(moveRed, 200);
  }
  moveRed();
});


// Jcrop
$(document).ready(function(){
  var jcrop = $.Jcrop('#mofat',{
    setSelect: [10,10,300,350],
    minSize:[50,50],
    onChange: function(coords) {
      // use the coordinates
    },
    onSelect: function(coords) {
      // use the coordinates
    }
  });
  
  $('#crop :button').click(function() {
    var selection = jcrop.tellSelect();
    alert('selected size: ' + selection.w + 'x' + selection.h);
  })
});


// colorbox
$(document).ready(function(){
  $('a[rel=celeb]').colorbox({
    transition: 'fade',
    speed: 500,
    current: "{current} of {total} celebrity photos"
  });

});

// lightbox
$(document).ready(function(){
  $('a.lightbox').click(function(e) {
    $('body').css('overflow-y', 'hidden'); // hide scrollbars!
    
    $('<div id="overlay"></div>')
      .css('top', $(document).scrollTop())
      .css('opacity', '0')
      .animate({'opacity': '0.5'}, 'slow')
      .appendTo('body');
      
    $('<div id="lightbox"></div>')
      .hide()
      .appendTo('body');
      
    $('<img>')
      .attr('src', $(this).attr('href'))
      .load(function() {
        positionLightboxImage();
      })
      .click(function() {
        removeLightbox();
      })
      .appendTo('#lightbox');
    
    return false;
  });
});

function positionLightboxImage() {
  var top = ($(window).height() - $('#lightbox').height()) / 2;
  var left = ($(window).width() - $('#lightbox').width()) / 2;
  $('#lightbox')
    .css({
      'top': top + $(document).scrollTop(),
      'left': left
    })
    .fadeIn();
}

function removeLightbox() {
  $('#overlay, #lightbox')
    .fadeOut('slow', function() {
      $(this).remove();
      $('body').css('overflow-y', 'auto'); // show scrollbars!
    });
}




$(document).ready(function(){
  $('#splitter > div:first').resizable({ 
    handles: 's', 
    minHeight : '50',
    maxHeight : '200',
    resize: function() { 
        var remainingSpace = $(this).parent().height() - $(this).outerHeight();
        var divTwo = $(this).next();
        var divTwoHeight = remainingSpace - (divTwo.outerHeight() - divTwo.height());
        divTwo.css('height', divTwoHeight + 'px');
    }
  });
});





// 20_resizable_textarea
$(document).ready(function(){
  $('textarea').resizable({
    grid : [20, 20],
    minWidth : 153,
    minHeight : 30,
    maxHeight : 220,
    containment: 'parent'
  });
});
 // 19_resizable_elements
 $(document).ready(function(){
 
 stylesheetToggle();
 $(window).resize(stylesheetToggle);
 });
 // 18_layout_switcher
function stylesheetToggle() {
  if ($('body').width() > 970) {
    $('<link rel="stylesheet" href="wide.css" type="text/css" />')
      .appendTo('head');
  } else {
    $('link[href="wide.css"]').remove();
  } 
}
// 17_resize_event
// $(document).ready(function() {
  // $(window).resize(function() {
  //  alert("You resized the window!");
 // });
// });
// 16_custom_scrollbar
$(document).ready(function() {
    $('#fine_print').jScrollPane({
        verticalGutter: 20
    });
});
// 15_page_scroll
$(document).ready(function() {
  $('a[href=#]').click(function(e) {
    $.scrollTo(0,'slow');
    e.preventDefault();
  });
});
// 14_floating_nav_2
$(document).ready(function() {
  var $window = $(window),
  $navigation = $("#navigation");

  $window.scroll(function() {
    if (!$navigation.hasClass("fixed") && ($window.scrollTop() > $navigation.offset().top)) {
        $navigation.addClass("fixed").data("top", $navigation.offset().top);
    }
    else if ($navigation.hasClass("fixed") && ($window.scrollTop() < $navigation.data("top"))) {
        $navigation.removeClass("fixed");
    }
  }); 
});
// 13_floating_nav_1
$(document).ready(function () {
  $(window).scroll(function () {
    $('#navigation').css('top', $(document).scrollTop()); 
  });
});
// 12_scroll_event
$(document).ready(function() {
  $('#news').scroll(function() {
    $('#header').append('<span class="scrolled">You scrolled!</span>');
  });
});
//11_jquery_ui_effects
$(document).ready(function() {
  $('p:first')
    .effect('shake', {times:3}, 300)
    .effect('highlight', {}, 3000)
    .hide('explode', {}, 1000);  
});
// 10_animated_navigation_2
$(document).ready(function() {
	$( '#navigation li' ).hover(function() {
		$(this)
			.stop(true)
			.animate({height: '60px'},
				{duration: 600, easing: 'easeOutBounce'}
			)
	},function() {
		$(this)
			.stop(true)
			.animate(
				{height:'20px'},
				{duration:600, easing: 'easeOutCirc'}
			)
	});
});
// 09_animated_navigation
$(document).ready( function () {
    $('<div id="navigation_blob"></div>').css({
      width: 0,
      height: $('#navigation li:first a').height() + 10
    }).appendTo('#navigation');

    $('#navigation a').hover(
      function () {// Mouse over function
        $('#navigation_blob').animate(
          {
            width: $(this).width() + 10, 
            left: $(this).position().left
          },
          {
            duration: 'slow', 
            easing: 'easeOutElastic',
            queue: false
          }
        );
      }, function() {// Mouse out function
        $('#navigation_blob').animate(
          {
            width: $(this).width() + 10, 
            left: $(this).position().left
           },
           {
             duration:'slow', 
             easing: 'easeOutCirc', 
             queue: false
           })
            .animate(
              {
                left: $('#navigation li:first a').position().left
              }, 'fast' 
            );
        }
    );
});
// 08_animation_queue
//$(document).ready(function(){
  //$('p:first').animate(
   // {
   //   height: '+=100px',
    //  color: 'green'
  //  },
  //  {
  //    duration: 'slow',
 //     easing: 'swing',
   //   complete: function() {alert('done!');},
  //    queue: false
  //  }
 // );
//});
// 07_bouncy_content_panes
//$(document).ready(function(){
  // hide all the content panes when the page loads
  //$('#bio > div').hide();
  
  // uncomment the next line if you'd like the first pane to be visible by default
  // $('#bio > div:first').show();
  
 // $('#bio h3').click(function() {
  //  $(this).next().animate({
   //   'height':'toggle'
  //  }, 'slow', 'easeOutBounce');
 // });
//});
// 06_other_easing_options
$(document).ready(function(){
  $('p:first').animate({height: '+=300px'}, 2000, 'easeOutBounce');
  $('p:first').animate({height: '-=300px'}, 2000, 'easeInOutExpo');
  $('p:first').animate({height: 'hide'}, 2000, 'easeOutCirc');
  $('p:first').animate({height: 'show'}, 2000, 'easeOutElastic');
});
// 05_easing
$(document).ready(function(){
  $('p:first').toggle(function() {
    $(this).animate( {'height':'+=150px'}, 2000, 'linear')
  }, function() {
    $(this).animate( {'height':'-=150px'}, 2000, 'swing');
  });
});
// 04_color_animation 
$(document).ready(function(){
  $('#disclaimer').animate({'backgroundColor':'#ff9f5f'}, 2000);
});
// 03_animate_show_hide 
$(document).ready(function(){
  $("#hideButton").click(function() {
    $('#disclaimer').animate({ 
      opacity: 'hide',
      height: 'hide'
    }, 'slow');    
  });
});
// 02_relative_css_animation 
 $(document).ready(function(){
  $('#navigation li').hover(function(){
    $(this).animate({
      paddingLeft: '+=15px'
     }, 200);
  }, function(){
   $(this).animate({
     paddingLeft: '-=15px'
   }, 200);
  });
 });

// 01_animating_css 

$(document).ready(function(){
  $('p').animate({ 
   padding: '20px',
   fontSize: '15px'
  }, 2000);
});





$(function(){
  //alert('Welcome to StarTrackr! Now no longer under police investigation!');
  //alert($('#celebs tbody tr:even').length + ' elements!');
 //$('#celebs tbody  tr:even').addClass('zebra');
  
  /*$('<input type="button" value="toggle"  id="toggleButton">').insertBefore('#disclaimer');
  $('#toggleButton').click(function() {
    $('#disclaimer').slideToggle('slow',function() {
      $('#toggleButton').fadeOut();
    });
  });
  
  $('<strong>START!</strong>').prependTo('#disclaimer');
  $('<strong>END!</strong>').appendTo('#disclaimer');*/
  
  $('#no-script').remove();
  
  $('#celebs tr').mouseover(function() {
    $(this).addClass('zebraHover');
  });
  
  $('#celebs tr').mouseover(function() {
    $(this).removeClass('zebraHover');
  });

});


$(document).ready(function(){
  alert($('#celebs tr').length + ' elements!');
});

$(document).ready(function(){
  var fontSize = $('#celebs tbody tr:first').css('font-size');
  alert(fontSize);
});

$(document).ready(function(){
  $('#celebs tbody tr:even').css('background-color','#dddddd');
});

$(document).ready(function(){
  $('#celebs tbody tr:even').css('background-color','#dddddd');
  $('#celebs tbody tr:even').css('color', '#666666');
});

$(document).ready(function(){
  $('#celebs tbody tr:even').css( 
    {'background-color': '#dddddd', 'color': '#666666'}  
  );
});

$(document).ready(function(){
  $('#celebs tbody tr:even').addClass('zebra');
});

$(document).ready(function() {
  $('#hideButton').click(function(){
    $('#disclaimer').hide();
  });
});

$(document).ready(function() {
  $('#hideButton').click(function(){
    $(this).hide();
  });
});
// revealling
$(document).ready(function(){
  $('#hideButton').click(function(){
    $('#disclaimer').hide();
  });
  $('#showButton').click(function(){
    $('#disclaimer').show();
  });
});
// toggle-1
$(document).ready(function(){
    $('#toggleButton').click(function(){
    if($('#disclaimer').is(':visible')) {
      $('#disclaimer').hide();
    } else {
      $('#disclaimer').show();
    }
  });
});
// toggle-2
$(document).ready(function(){
  $('#toggleButton').click(function(){
    $('#disclaimer').toggle();
  });
});
// toggle-text
$(document).ready(function(){
  $('#toggleButton').click(function(){
    $('#disclaimer').toggle();
    
    if($('#disclaimer').is(':visible')) {
      $(this).val('Hide');
    } else {
      $(this).val('Show');
    }
  });
});

$(document).ready(function(){
  $('<input type="button" value="toggle" id="toggleButton">').insertAfter('#disclaimer');
  $('#toggleButton').click(function(){
    $('#disclaimer').toggle();
  });
});

$(document).ready(function(){
  $('<input type="button" value="toggle" id="toggleButton">').insertBefore('#disclaimer');
  $('#toggleButton').click(function(){
    $('#disclaimer').toggle();
  });
});

$(document).ready(function(){
  $('<strong>START!</strong>').prependTo('#disclaimer');
  $('<strong>END!</strong>').appendTo('#disclaimer');
});

$(document).ready(function(){
  $('#no-script').remove();
});
// removing-with-selector
$(document).ready(function(){
  $('#celebs tr').remove(':contains("Singer")');
});

// $(document).ready(function(){
 //  $('p').html('good bye, cruel    
// paragraphs!');
//  $('h2').text('All your titles are belong
// to us');
// });

// $(document).ready(function(){
 // $('p').html('<strong>Warning!</strong> 
//Text has been replaced for your safety.');
 // $('h2').text('<strong>Warning!</strong>
// Title elements can be hazardous to your
// health.');
// });

$(document).ready(function(){
  alert($('h2:first').text());
});

$(document).ready(function(){
  $('#hideButton').click(function(){
    $('#disclaimer').fadeOut();
  });
});

$(document).ready(function(){
  $('#toggleButton').click(function(){
    $('#disclaimer').toggle('slow');
  });
});
// call back-functions
$(document).ready(function(){
  $('#toggleButton').click(function(){
    $('#disclaimer').slideToggle('slow', function(){
  //    alert('The slide has finished sliding!')
    });
  });
});

$(document).ready(function(){
  $('#hideButton').click(function(){
    $('#disclaimer').slideUp('slow', function(){
      $('#hideButton').fadeOut();
    });
  });
});

$(document).ready(function(){
  $('#celebs tbody tr:even').addClass('zebra');
  $('#celebs tbody tr').mouseover(function(){
    $(this).addClass('zebraHover');
  });
  $('#celebs tbody tr').mouseout(function(){
    $(this).removeClass('zebraHover');
  });
});

$(document).ready(function(){
  $('#celebs tbody tr:even').addClass('zebra');
  $('#celebs tbody tr').hover(function(){
    $(this).addClass('zebraHover');
  }, function(){
    $(this).removeClass('zebraHover');
  });
});

$(document).ready(function(){
  $('#celebs tbody tr:even').addClass('zebra');
  $('#celebs tbody tr').click(function(){
    $(this).toggleClass('zebraHover');
  });
});

$(document).ready(function(){
  $('.spoiler').hide();
  $('<input type="button" class="revealer" value="Tell Me!"/>').insertBefore('.spoiler');
  $('.revealer').click(function(){
    $(this).hide();
    $(this).next().fadeIn();
  });
});

$(document).ready(function(){
  $('a.lightbox').click(function(e) {
    $('body').css('overflow-y', 'hidden'); // hide scrollbars!
    
    $('<div id="overlay"></div>')
      .css('top', $(document).scrollTop())
      .css('opacity', '0')
      .animate({'opacity': '0.5'}, 'slow')
      .appendTo('body');
      
    $('<div id="lightbox"></div>')
      .hide()
      .appendTo('body');
      
    $('<img>')
      .attr('src', $(this).attr('href'))
      .load(function() {
        positionLightboxImage();
      })
      .click(function() {
        removeLightbox();
      })
      .appendTo('#lightbox');
    
    return false;
  });
});

function positionLightboxImage() {
  var top = ($(window).height() - $('#lightbox').height()) / 2;
  var left = ($(window).width() - $('#lightbox').width()) / 2;
  $('#lightbox')
    .css({
      'top': top + $(document).scrollTop(),
      'left': left
    })
    .fadeIn();
}

function removeLightbox() {
  $('#overlay, #lightbox')
    .fadeOut('slow', function() {
      $(this).remove();
      $('body').css('overflow-y', 'auto'); // show scrollbars!
    });
}
/*  document_ready */
$(function(){
  //alert('Welcome to StarTrackr! Now no longer under police investigation!');
  //alert($('#celebs tbody tr:even').length + ' elements!');
 //$('#celebs tbody  tr:even').addClass('zebra');
  
  /*$('<input type="button" value="toggle"  id="toggleButton">').insertBefore('#disclaimer');
  $('#toggleButton').click(function() {
    $('#disclaimer').slideToggle('slow',function() {
      $('#toggleButton').fadeOut();
    });
  });
  
  $('<strong>START!</strong>').prependTo('#disclaimer');
  $('<strong>END!</strong>').appendTo('#disclaimer');*/
  
  $('#no-script').remove();
  
  $('#celebs tr').mouseover(function() {
    $(this).addClass('zebraHover');
  });
  
  $('#celebs tr').mouseover(function() {
    $(this).removeClass('zebraHover');
  });


});
/* animating_css */
$(document).ready(function() {
  $('p:first')
    .effect('shake', {times:3}, 300)
    .effect('highlight', {}, 3000)
    .hide('explode', {}, 1000);  
});

$(document).ready(function(){
  gallery.trigger = $("#photos .trigger");
  gallery.content = $("#photos_inner");
  gallery.scroll = false;
  gallery.width = 400;
  gallery.innerWidth = gallery.content.width();
  gallery.timer = false;
  gallery.init();
});

gallery = {};

gallery.offset = function() {
  var left = gallery.content.position().left;
  
	if (gallery.scroll == '>') {
    if (left < 0) {
      left += gallery.width;
    }
  }
  else {
    if (left <= 0 && left >= ((gallery.innerWidth * -1) + (gallery.width * 2))) {
      left -= gallery.width;
    }
  }
  return left + "px";
}

gallery.slide = function() {
  
	if (gallery.timer) {
    clearTimeout(gallery.timer);
  }
  if (gallery.scroll) {
    $(gallery.content).stop(true,true).animate({left: gallery.offset()}, 500);
    gallery.timer = setTimeout(gallery.slide, 1000)
  }
}

gallery.direction = function(e,which) {
  var x = e.pageX - which.offset().left;
  gallery.scroll = (x >= gallery.width / 2) ? ">" : "<";
}

gallery.init = function() {
  $(gallery.trigger)
    .mouseout(function() {gallery.scroll = false;})
    .mousemove(function(e) {gallery.direction(e,gallery.trigger);})
    .mouseover(function(e) {
      gallery.direction(e,gallery.trigger);
      gallery.slide();
    });
}






























































