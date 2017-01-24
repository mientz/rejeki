var App = (function () {
    'use strict';

    App.masks = function () {
        $.mask.definitions['C'] = "[A-Z]";
        $.mask.definitions['s'] = "[A-Z ]";
        $.mask.definitions['n'] = "[0-9 ]";
        $("[data-mask='date']").mask("99/99/9999");
        $("[data-mask='phone']").mask("(999) 999-9999");
        $("[data-mask='phone-ext']").mask("(999) 999-9999? x99999");
        $("[data-mask='phone-int']").mask("+33 999 999 999");
        $("[data-mask='phone-mobile']").mask("+62 99 999 999 999?9");
        $("[data-mask='taxid']").mask("99-9999999");
        $("[data-mask='ssn']").mask("999-99-9999");
        $("[data-mask='product-key']").mask("a*-999-a999");
        $("[data-mask='percent']").mask("99%");
        $("[data-mask='year']").mask("9999");
        $("[data-mask='currency']").mask("Rp. 9?99,999,999", {
            autoclear: false
        });
        $("[data-mask='license-plate-first']").mask("C?C", {
            autoclear: false
        });
        $("[data-mask='license-plate-second']").mask("9?999", {
            autoclear: false
        });
        $("[data-mask='license-plate-third']").mask("C?CC", {
            autoclear: false
        });

    };

    return App;
})(App || {});
