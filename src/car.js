function addCarsPage(){
    App.masks();
    $('.be-content').find('#form-new-cars').validator();
    $('.be-content').find('#form-new-cars').validator().on('submit', function(e){
        if (e.isDefaultPrevented()) {
            e.preventDefault();
            $(this).validator('validate');
            console.log('validate failed')
            return false;
        } else {
            e.preventDefault();
            var formdata = $(this).serializeJSON();
            var queryData = {
                type: formdata.type,
                name: formdata.name,
                year: formdata.year,
                fuel: formdata.fuel,
                license_plate: formdata.license_plate.join(' '),
                ownership: formdata.ownership,
            }
            setCars(queryData, function(data, err){
                if(err == null){
                    $.gritter.add({
                        title: 'Berhasil',
                        text: 'Data mobil baru telah tersimpan',
                        class_name: 'color success'
                    });
                    pageRender('cars/list.html');
                }else{
                    $.gritter.add({
                        title: 'Gagal',
                        text: err,
                        class_name: 'color danger'
                    });
                }
            });
            return false;
        }
    })
}

function listCarsPage(){
    getCars(function(data, err){
        var carsTable = $("#cars-table").DataTable({
            "data" : data,
            "columns" : [
                { "data": "license_plate" },
                { "data": "name" },
                { "data": "year" },
                { "data": "fuel" },
                { "data": "type" },
                { "data": "ownership" },
                {
                    "data": "id",
                    "render":function(id){
                        return '<div class="btn-group btn-space">'+
                            '<a href="cars/pricing.html" type="button" class="btn btn-default btn-evernote car-table-edit page-link" data-param='+JSON.stringify({ id:id })+'><i class="icon mdi mdi-money-box text-success"></i></a>'+
                            '<a href="cars/edit.html" type="button" class="btn btn-default car-table-edit page-link" data-param='+JSON.stringify({ id:id })+'><i class="icon mdi mdi-edit"></i></a>'+
                            '<button type="button" data-toggle="modal" data-target="#mod-car-delete" class="btn btn-danger car-table-delete" data-id="'+id+'"><i class="icon mdi mdi-delete"></i></button>'+
                            '</div>';
                    }
                }
            ],
            pageLength: 10,
            "language": {
                "searchPlaceholder": 'Cari Kendaraan',
            }
        });
        $('#mod-car-delete').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget)
            var id = button.data('id')
            var modal = $(this)
            getCars(id, function(data, err){
                modal.find('.mod-car-delete-detail').html(data.name+' '+data.year+' <u>'+data.license_plate+'</u>')
                modal.find('.btn-confirm-delete').on('click', function(){
                    deleteCars(id, function(res, err){
                        if(err == null){
                            $.gritter.add({
                                title: 'Berhasil Menghapus',
                                text: data.name+' '+data.year+' <u>'+data.license_plate+'</u>',
                                class_name: 'color success'
                            });
                            carsTable.row( button.parents('tr') ).remove().draw();
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
    })
}

function editCarsPage(id){
    App.masks();
    getCars(id, function(data, err){
        $("#form-edit-cars").find("input[name='license_plate[]']").each(function(index, elm){
            $(elm).val(data.license_plate.split(" ")[index])
        });
        $("#form-edit-cars").find("input[name='type']").each(function(index, elm){
            if( $(elm).val() == data.type ){
                $(elm).attr('checked', '');
            }
        });
        $("#form-edit-cars").find("input[name='name']").val(data.name);
        $("#form-edit-cars").find("input[name='year']").val(data.year);
        $("#form-edit-cars").find("select[name='fuel'] option").each(function(index, elm){
            if( $(elm).val() == data.fuel ){
                $(elm).attr('selected', '');
            }
        });
        $("#form-edit-cars").find("input[name='ownership']").val(data.ownership);
    })
    $('.be-content').find('#form-edit-cars').validator();
    $('.be-content').find('#form-edit-cars').validator().on('submit', function(e){
        if (e.isDefaultPrevented()) {
            e.preventDefault();
            $(this).validator('validate');
            console.log('validate failed')
            return false;
        } else {
            e.preventDefault();
            var formdata = $(this).serializeJSON();
            var queryData = {
                type: formdata.type,
                name: formdata.name,
                year: formdata.year,
                fuel: formdata.fuel,
                license_plate: formdata.license_plate.join(' '),
                ownership: formdata.ownership,
            }
            setCars(id, queryData, function(data, err){
                if(err == null){
                    $.gritter.add({
                        title: 'Berhasil',
                        text: 'Perubahan data mobil telah tersimpan',
                        class_name: 'color success'
                    });
                    pageRender('cars/list.html');
                }else{
                    $.gritter.add({
                        title: 'Gagal',
                        text: err,
                        class_name: 'color danger'
                    });
                }
            });
            return false;
        }
    })
}

function carsPricingPage(id){
    getCars(id, function(data, err){
        $(".panel-heading").find("span").html(data.name+' '+data.year+' <u>'+data.license_plate+'</u> <small>'+ data.fuel+'</small>');
        getCarsPricing(id, function(data, err){
            var carsTable = $("#cars-pricing-table").DataTable({
                "data" : data,
                "columns" : [
                    {
                        "data": "id",
                        render: function (data, type, row, meta) {
                            return meta.row + meta.settings._iDisplayStart + 1;
                        }
                    },
                    { "data": "destination" },
                    {
                        "data": "price" ,
                        "render": function(price){
                            return "Rp. "+parseInt(price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                        }
                    },
                    {
                        "data": "id",
                        "render":function(id){
                            return '<div class="btn-group btn-space pull-right">'+
                                '<button type="button" data-toggle="modal" data-target="#mod-car-pricing-edit" data-backdrop="false" class="btn btn-default car-table-edit" data-id='+id+'><i class="icon mdi mdi-edit"></i></button>'+
                                '<button type="button" data-toggle="modal" data-target="#mod-car-pricing-delete" data-backdrop="false" class="btn btn-danger car-table-delete" data-id="'+id+'"><i class="icon mdi mdi-delete"></i></button>'+
                                '</div>';
                        }
                    }
                ],
                pageLength: 10,
                "language": {
                    "searchPlaceholder": 'Cari Kendaraan',
                }
            })
        })
        $('#mod-car-pricing-add').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget)
            var modal = $(this)
            modal.find('.btn-confirm-add').on('click', function(e){
                e.preventDefault()
                var priceData = modal.find('form').serializeJSON();
                var queryData = {
                    car_id:id,
                    destination:priceData.destination,
                    price:priceData.price.replace(/\D/g, ''),
                }
                console.log(queryData)
                setCarsPricing(queryData, function(res, err){
                    if(err == null){
                        $.gritter.add({
                            title: 'Berhasil',
                            text: 'Data harga sewa baru telah tersimpan',
                            class_name: 'color success'
                        });
                        modal.find('form')[0].reset();
                        pageRender('cars/pricing.html', {id:id})
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
        $('#mod-car-pricing-edit').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget)
            var priceid = button.data('id')
            var modal = $(this)
            getCarsPricing(id, priceid, function(data, err){
               modal.find("[name='destination']").val(data.destination)
               modal.find("[name='price']").val(data.price)
               App.masks();
            });
            modal.find('.btn-confirm-add').on('click', function(e){
                e.preventDefault()
                var priceData = modal.find('form').serializeJSON();
                var queryData = {
                    destination:priceData.destination,
                    price:priceData.price.replace(/\D/g, ''),
                }
                console.log(queryData)
                setCarsPricing(priceid, queryData, function(res, err){
                    if(err == null){
                        $.gritter.add({
                            title: 'Berhasil',
                            text: 'Data harga sewa baru telah tersimpan',
                            class_name: 'color success'
                        });
                        modal.find('form')[0].reset();
                        pageRender('cars/pricing.html', {id:id})
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
        $('#mod-car-pricing-delete').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget)
            var priceid = button.data('id')
            var modal = $(this)
            getCarsPricing(id, priceid, function(data, err){
                modal.find('.mod-car-pricing-delete-detail').html('<u>'+data.destination+'</u>')
                modal.find('.btn-confirm-delete').on('click', function(){
                    deleteCarsPricing(priceid, function(res, err){
                        if(err == null){
                            $.gritter.add({
                                title: 'Berhasil Menghapus',
                                text: '<u>'+data.destination+'</u>',
                                class_name: 'color success'
                            });
                            pageRender('cars/pricing.html', {id:id})
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
    })
}
