// 09_cycle_plugin
$(document).ready(function(){
  $('#photos').cycle({
    fx: 'shuffle'
  });
});



// jquery.innerfade.js
$(document).ready(function() {
  $('#news ul').innerfade({
    animationtype: 'slide',
    speed: 750,
    timeout: 3000,
    type: 'random'
  });
});
/* =========================================================

// jquery.innerfade.js

// Datum: 2008-02-14
// Firma: Medienfreunde Hofmann & Baldes GbR
// Author: Torsten Baldes
// Mail: t.baldes@medienfreunde.com
// Web: http://medienfreunde.com

// based on the work of Matt Oakes http://portfolio.gizone.co.uk/applications/slideshow/
// and Ralf S. Engelschall http://trainofthoughts.org/

 *
 *  <ul id="news"> 
 *      <li>content 1</li>
 *      <li>content 2</li>
 *      <li>content 3</li>
 *  </ul>
 *  
 *  $('#news').innerfade({ 
 *	  animationtype: Type of animation 'fade' or 'slide' (Default: 'fade'), 
 *	  speed: Fading-/Sliding-Speed in milliseconds or keywords (slow, normal or fast) (Default: 'normal'), 
 *	  timeout: Time between the fades in milliseconds (Default: '2000'), 
 *	  type: Type of slideshow: 'sequence', 'random' or 'random_start' (Default: 'sequence'), 
 * 		containerheight: Height of the containing element in any css-height-value (Default: 'auto'),
 *	  runningclass: CSS-Class which the container get’s applied (Default: 'innerfade'),
 *	  children: optional children selector (Default: null)
 *  }); 
 *

// ========================================================= */


(function($) {

    $.fn.innerfade = function(options) {
        return this.each(function() {   
            $.innerfade(this, options);
        });
    };

    $.innerfade = function(container, options) {
        var settings = {
        		'animationtype':    'fade',
            'speed':            'normal',
            'type':             'sequence',
            'timeout':          2000,
            'containerheight':  'auto',
            'runningclass':     'innerfade',
            'children':         null
        };
        if (options)
            $.extend(settings, options);
        if (settings.children === null)
            var elements = $(container).children();
        else
            var elements = $(container).children(settings.children);
        if (elements.length > 1) {
            $(container).css('position', 'relative').css('height', settings.containerheight).addClass(settings.runningclass);
            for (var i = 0; i < elements.length; i++) {
                $(elements[i]).css('z-index', String(elements.length-i)).css('position', 'absolute').hide();
            };
            if (settings.type == "sequence") {
                setTimeout(function() {
                    $.innerfade.next(elements, settings, 1, 0);
                }, settings.timeout);
                $(elements[0]).show();
            } else if (settings.type == "random") {
            		var last = Math.floor ( Math.random () * ( elements.length ) );
                setTimeout(function() {
                    do { 
												current = Math.floor ( Math.random ( ) * ( elements.length ) );
										} while (last == current );             
										$.innerfade.next(elements, settings, current, last);
                }, settings.timeout);
                $(elements[last]).show();
						} else if ( settings.type == 'random_start' ) {
								settings.type = 'sequence';
								var current = Math.floor ( Math.random () * ( elements.length ) );
								setTimeout(function(){
									$.innerfade.next(elements, settings, (current + 1) %  elements.length, current);
								}, settings.timeout);
								$(elements[current]).show();
						}	else {
							alert('Innerfade-Type must either be \'sequence\', \'random\' or \'random_start\'');
						}
				}
    };

    $.innerfade.next = function(elements, settings, current, last) {
        if (settings.animationtype == 'slide') {
            $(elements[last]).slideUp(settings.speed);
            $(elements[current]).slideDown(settings.speed);
        } else if (settings.animationtype == 'fade') {
            $(elements[last]).fadeOut(settings.speed);
            $(elements[current]).fadeIn(settings.speed, function() {
							removeFilter($(this)[0]);
						});
        } else
            alert('Innerfade-animationtype must either be \'slide\' or \'fade\'');
        if (settings.type == "sequence") {
            if ((current + 1) < elements.length) {
                current = current + 1;
                last = current - 1;
            } else {
                current = 0;
                last = elements.length - 1;
            }
        } else if (settings.type == "random") {
            last = current;
            while (current == last)
                current = Math.floor(Math.random() * elements.length);
        } else
            alert('Innerfade-Type must either be \'sequence\', \'random\' or \'random_start\'');
        setTimeout((function() {
            $.innerfade.next(elements, settings, current, last);
        }), settings.timeout);
    };

})(jQuery);

// **** remove Opacity-Filter in ie ****
function removeFilter(element) {
	if(element.style.removeAttribute){
		element.style.removeAttribute('filter');
	}
}

// 07_slideshow_cross_fade
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



// 06_slideshow_fade
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

// chapter_04/05_timers
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



// 04_rollover_fade
$(document).ready(function() {
  $('#fader').hover(function() {
    $(this).find('img:eq(1)').stop(true,true).fadeIn();
  }, function() {
    $(this).find('img:eq(1)').fadeOut();
  })
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

// 02_colorbox_plugin
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

//
$(document).ready(function(){
  $('#info p:not(:first)').hide();
  
  $('#info-nav li').click(function(event) {
    event.preventDefault();
    $('#info p').hide();
    $('#info-nav .current').removeClass("current");
    $(this).addClass('current');
    
    var clicked = $(this).find('a:first').attr('href');
    $('#info ' + clicked).fadeIn('fast');
  }).eq(0).addClass('current');
});


$(document).ready(function(){
  $('#menu li ul').css({
    display: "none",
    left: "auto"
  });
  $('#menu li').hover(function() {
    $(this)
      .find('ul')
      .stop(true, true)
      .slideDown('fast');
  }, function() {
    $(this)
      .find('ul')
      .stop(true,true)
      .fadeOut('fast');
  });
});

$(document).ready(function(){
$( '#menu > li > ul' )
	.hide()
	.click(function( e ){
		e.stopPropagation();
	});
	
  $('#menu > li').toggle(function(){
	  $(this)
      .css('background-position', 'right -20px')
      .find('ul').slideDown();
  }, function(){
  	$( this )
      .css('background-position', 'right top')
      .find('ul').slideUp();
  });
});

$(document).ready(function(){
$( '#menu > li > ul' )
	.hide()
	.click(function( e ){
		e.stopPropagation();
	});
  $('#menu > li').toggle(function(){
	  $(this)
      .removeClass('waiting')
      .css('background-position', 'right -20px')
      .find('ul').slideDown();
  }, function(){
  	$( this )
      .removeClass('waiting')
      .css('background-position', 'right top')
      .find('ul').slideUp();
  });
  
  $('#menu > li').hover(function() {
    $(this).addClass('waiting');
    setTimeout(function() {
      $('#menu .waiting')
        .click()
        .removeClass('waiting');
    }, 600);
  }, function() {
    $('#menu .waiting').removeClass('waiting');
  });
});

$(document).ready(function(){
  $('#celebs ul > li ul')
    .click(function(event){
      event.stopPropagation();
    })
    .filter(':not(:first)')
    .hide();
    
  $('#celebs ul > li').click(function(){
    var selfClick = $(this).find('ul:first').is(':visible');
    if(!selfClick) {
      $(this)
        .parent()
        .find('> li ul:visible')
        .slideToggle();
    }
    
    $(this)
      .find('ul:first')
      .stop(true, true)
      .slideToggle();
  });
});
$(document).ready(function(){
  $('#celebs ul > li ul')
    .click(function(event){
      event.stopPropagation();
    })
    .filter(':not(:first)')
    .hide();
    
  $('#celebs ul > li').click(function(){
    var selfClick = $(this).find('ul:first').is(':visible');
    if(selfClick) {
      return;
    }
    $(this)
      .parent()
      .find('> li ul:visible')
      .slideToggle();
    
    $(this)
      .find('ul:first')
      .stop(true, true)
      .slideToggle();
  });
});
$(document).ready(function(){
  $('#accordion > li ul')
    .click(function(event){
      event.stopPropagation();
    })
    .filter(':not(:first)')
    .hide();
    
  $('#accordion > li, #accordion > li > ul > li').click(function(){
    var selfClick = $(this).find('ul:first').is(':visible');
    if(!selfClick) {
      $(this)
        .parent()
        .find('> li ul:visible')
        .slideToggle();
    }
    
    $(this)
      .find('ul:first')
      .stop(true, true)
      .slideToggle();
  });
});
$(document).ready(function(){
  $('#accordion').accordion({header: 'h3'});
  $('#accordion').accordion('activate', 2);
});

// 01_document_ready
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

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Activate SimpleLightbox plugin for portfolio items
    new SimpleLightbox({
        elements: '#portfolio a.portfolio-box'
    });

});
