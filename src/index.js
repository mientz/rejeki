$(document).ready(function(){
    // default deffinition

    //We use this to apply style to certain elements
    $.extend( true, $.fn.dataTable.defaults, {
        dom:
        "<'row be-datatable-header'<'col-sm-6'l><'col-sm-6'<'pull-right'f>>>" +
        "<'row be-datatable-body'<'col-sm-12'tr>>" +
        "<'row be-datatable-footer'<'col-sm-5'i><'col-sm-7'<'pull-right'p>>>",
        "language": {
            "emptyTable": "Tidak ada data tersedia",
            "lengthMenu": "Tampilkan _MENU_ data per halaman",
            "zeroRecords": "Tidak ada data yang cocok dengan pencarian anda",
            "info": "Hal _PAGE_ dari _PAGES_ halaman",
            "infoEmpty": "Tidak ada data tersedia",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "paginate": {
                "first":      '<i class="mdi mdi-caret-left-circle"></i>',
                "last":       '<i class="mdi mdi-caret-right-circle"></i>',
                "next":       '<i class="mdi mdi-caret-right-circle"></i>',
                "previous":   '<i class="mdi mdi-caret-left-circle"></i>'
            },
            "search": '<i class="mdi mdi-search" style="padding-right:5px;font-size:20px;"></i>',
            "searchPlaceholder": '<i class="mdi mdi-search" style="padding-right:5px;font-size:20px;"></i>',
        }
    } );


    if(localStorage.activePage != '' && localStorage.activePage != null && typeof(localStorage.activePage) != 'undefined'){
        var currentTemplate = fs.readFileSync('www/template/'+localStorage.activePage, 'utf-8');
        var data = {};
        if(localStorage.activePageData != '' && localStorage.activePageData != 'undefined' && localStorage.activePageData != null && typeof(localStorage.activePageData) != 'undefined'){
            data = JSON.parse(localStorage.activePageData);
        }
        $('.page-link-sidebar[href$="'+localStorage.activePage+'"]').parent().parent().parent().addClass('active');
        $('.page-link-sidebar[href$="'+localStorage.activePage+'"]').parent().parent().parent().addClass('open');
        $('.page-link-sidebar[href$="'+localStorage.activePage+'"]').parent().addClass('active');
        $('.be-content').html(Twig.twig({data:currentTemplate}).render(data));
        $('.page-title span').html($('.be-content').find('.main-content').data('title'));
        console.log(data);

        App.masks();
    }

    $(document).on('click', '.page-link', function(e){
        e.preventDefault();
        pageRender($(this).attr('href'), $(this).data('param'));
    });

    getUser(localStorage.userId, function(data){
        var container = $('.be-user-nav')
        container.find('img').attr('src', App.conf.assetsPath + '/' +  App.conf.imgPath + '/' + data.image);
        container.find('.user-name').html(data.realname);
        container.find('.user-position').html(data.username);
    });

    $('#btn-logout').on('click', function(){
        localStorage.clear();
        location.replace('login.html');
    })
});

function pageRender(template, data){
    var currentTemplate = fs.readFileSync('www/template/'+template, 'utf-8');
    $('.be-content').html(Twig.twig({data:currentTemplate}).render(data));
    $('.page-title span').html($('.be-content').find('.main-content').data('title'));
    localStorage.activePage = template;
    localStorage.activePageData = JSON.stringify(data);
    $('.page-link-sidebar').parent().parent().parent().removeClass('active');
    $('.page-link-sidebar').parent().removeClass('active');
    $('.page-link-sidebar[href$="'+localStorage.activePage+'"]').parent().parent().parent().addClass('active');
    $('.page-link-sidebar[href$="'+localStorage.activePage+'"]').parent().addClass('active');
}

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
