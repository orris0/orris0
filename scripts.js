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
  alert($('#celebs tbody tr:even').length + ' elements!');
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






