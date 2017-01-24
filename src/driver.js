function driverListPage(){
    getDriver(function(data, err){
        var driveTable = $("#driver-table").DataTable({
            "data" : data,
            "columns" : [
                {
                    "data": "id",
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                { "data": "name" },
                { "data": "tel" },
                { "data": "address" },
                { "data": "license" },
                {
                    "data": "id",
                    "render":function(id){
                        return '<div class="btn-group btn-space pull-right">'+
                            '<button type="button" data-toggle="modal" data-target="#mod-driver-edit" data-backdrop="false" class="btn btn-default car-table-edit" data-id='+id+'><i class="icon mdi mdi-edit"></i></button>'+
                            '<button type="button" data-toggle="modal" data-target="#mod-driver-delete" data-backdrop="false" class="btn btn-danger car-table-delete" data-id="'+id+'"><i class="icon mdi mdi-delete"></i></button>'+
                            '</div>';
                    }
                }
            ],
            pageLength: 10,
            "language": {
                "searchPlaceholder": 'Cari Kendaraan',
            }
        });
    })
    $('#mod-driver-add').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var modal = $(this)
        modal.find('.btn-confirm-add').on('click', function(e){
            e.preventDefault()
            var priceData = modal.find('form').serializeJSON();
//            console.log(queryData)
            setDriver(priceData, function(res, err){
                if(err == null){
                    $.gritter.add({
                        title: 'Berhasil',
                        text: 'Data sopir baru telah tersimpan',
                        class_name: 'color success'
                    });
                    modal.find('form')[0].reset();
                    pageRender('driver/list.html', {})
                }else{
                    $.gritter.add({
                        title: 'Gagal',
                        text: err,
                        class_name: 'color danger'
                    });
                }
            })
        })
    })
    $('#mod-driver-edit').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var driverId = button.data('id');
        var modal = $(this)
        getDriver(driverId, function(data, err){
            modal.find("[name='name']").val(data.name)
            modal.find("[name='tel']").val(data.tel)
            modal.find("[name='address']").val(data.address)
            modal.find("[name='license']").val(data.license)
        })
        modal.find('.btn-confirm-add').on('click', function(e){
            e.preventDefault()
            var priceData = modal.find('form').serializeJSON();
            setDriver(driverId, priceData, function(res, err){
                if(err == null){
                    $.gritter.add({
                        title: 'Berhasil',
                        text: 'Data sopir baru telah tersimpan',
                        class_name: 'color success'
                    });
                    modal.find('form')[0].reset();
                    pageRender('driver/list.html', {})
                }else{
                    $.gritter.add({
                        title: 'Gagal',
                        text: err,
                        class_name: 'color danger'
                    });
                }
            })
        })
    })
    $('#mod-driver-delete').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var driverId = button.data('id')
        var modal = $(this)
        getDriver(driverId, function(data, err){
            modal.find('.mod-car-pricing-delete-detail').html('<u>'+data.name+'</u>')
            modal.find('.btn-confirm-delete').on('click', function(){
                deleteDriver(driverId, function(res, err){
                    if(err == null){
                        $.gritter.add({
                            title: 'Berhasil Menghapus',
                            text: '<u>'+data.name+'</u>',
                            class_name: 'color success'
                        });
                        pageRender('driver/list.html', {})
                    }else{
                        $.gritter.add({
                            title: 'Gagal Menghapus',
                            text: err,
                            class_name: 'color danger'
                        });
                    }
                });
            });
        });
    })
}
