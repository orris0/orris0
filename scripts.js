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
