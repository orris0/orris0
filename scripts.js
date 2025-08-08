// Scripts
// Scripts

// multiple_properties_2
$(document).ready(function(){
  $('#celebs tbody tr:even').css( 
    {'background-color': '#dddddd', 'color': '#666666'}  
  );
});


// multiple_properties_1
$(document).ready(function(){
  $('#celebs tbody tr:even').css('background-color','#dddddd');
  $('#celebs tbody tr:even').css('color', '#666666');
});
// zebra_striping
$(document).ready(function(){
  $('#celebs tbody tr:even').css('background-color','#dddddd');
});


// reading_css_properties
$(document).ready(function(){
  var fontSize = $('#celebs tbody tr:first').css('font-size');
  alert(fontSize);
});

//filters
$(document).ready(function(){
  alert($('#celebs tbody tr:even').length + ' elements!');
});

// narrowing_selection
$(document).ready(function(){
  alert($('#celebs tbody tr').length + ' elements!');
});

// documment ready
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

// client side templating
            function template(row, cart) {
  row.find('.item_name').text(cart.name);
  row.find('.item_qty').text(cart.qty);
  row.find('.item_total').text(cart.total);
  return row;
}

$(document).ready(function() {
  var newRow = $('#cart .template').clone().removeClass('template');
  var cartItem = {
    name: 'Glendatronix',
    qty: 1,
    total: 450
  };
  template(newRow, cartItem)
    .appendTo('#cart')
    .fadeIn();  
});

           /* $(function () {
                alert('Welcome to StarTracker! Now no longer under police investigation!');
            });

            $(function () {
                alert('Ready to do your bidding!');
            });

            $('p,div,h1,input') */
    
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
