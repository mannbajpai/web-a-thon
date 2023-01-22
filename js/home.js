$(document).ready(function(){
    
    
  $('input').prev('label').addClass('inactive');
  $('#signup').hide();

  $('.tab a').on('click', function(e){
      e.preventDefault(); 
      
      /* To activate login or signup tab */
      $(this).addClass('activate'); 
      $(this).parent().siblings().children().removeClass('activate');
      
  
      target = $(this).attr('href');
      $('#tab_content > div').not(target).hide();
      $(target).fadeIn(600);
  });
  
 
  $('input').focus(function(){
      $(this).prev('label').addClass('active');
  });

  $('input').blur(function(){
      var $this = $(this);
      if ( $this.val() === '' ) {
          $(this).prev('label').removeClass('active');
          $(this).prev('label').addClass('inactive');
      }
      else {
          $(this).prev('label').removeClass('inactive');
          $(this).prev('label').addClass('active');
      }
  });
});