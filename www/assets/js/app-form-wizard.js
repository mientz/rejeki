var App = (function () {
  'use strict';

  App.wizard = function( ){

    //Fuel UX
    $('.wizard-ux').wizard({
//        disablePreviousStep: true
    });

    $('.wizard-ux').on('changed.fu.wizard',function(){
      //Bootstrap Slider
      $('.bslider').slider();
    });

    $(".wizard-next").click(function(e){
      var id = $(this).data("wizard");
      $(id).wizard('next');
      e.preventDefault();
    });

    $(".wizard-previous").click(function(e){
      var id = $(this).data("wizard");
      $(id).wizard('previous');
      e.preventDefault();
    });


  };

  return App;
})(App || {});
