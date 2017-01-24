var App = (function () {
    'use strict';

    App.formElements = function () {
        //Js Code
        $(".datetimepick").datetimepicker({
            autoclose: true,
            componentIcon: '.mdi.mdi-calendar',
            navIcons: {
                rightIcon: 'mdi mdi-chevron-right',
                leftIcon: 'mdi mdi-chevron-left'
            },
            format: 'd MM yyyy hh:ii',
            language: 'id'
        });
        //
        //    //Select2
        //    $(".select2").select2({
        //      width: '100%'
        //    });
        //
        //    //Select2 tags
        //    $(".tags").select2({tags: true, width: '100%'});

        //Bootstrap Slider
        //    $('.bslider').bootstrapSlider();

    };

    return App;
})(App || {});
