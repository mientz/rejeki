function newOrdersPage(){
    var ordersDetailTable = $('#rent-cars-table').DataTable();
    var invoice = $('.invoice');
    App.formElements();
    moment.locale('id');
    var ordersNumber = moment().format('X')+'/R-TRANS/'+ moment().format('YYYY');
    $('.invoice .invoice-id').html('Invoice #'+ordersNumber)
    $('.invoice .incoice-date').html(moment().format('DD MMMM YYYY'))
    $('[name="name"]').on('change', function(){
        invoice.find('.invoice-person .name').html($(this).val());
    })
    $('[name="address"]').on('change', function(){
        invoice.find('.invoice-person .address').html($(this).val());
    })
    $('[name="tel"]').on('change', function(){
        invoice.find('.invoice-person .tel').html($(this).val());
    })

    $('#mod-rent-car-add').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var modal = $(this)
        modal.find('form').validator()
        var counter = 0
        getCars(function(data, err){
            var reData = [{
                text: 'Tersedia Saat Ini',
                children: []
            },{
                text: 'Tidak Tersedia Saat Ini',
                children: []
            }];
            $.each(data, function(index, row){
                if(row.status == 1){
                    reData[0].children.push({
                        id:row.id,
                        text:row.name+' '+row.year+' | '+row.license_plate
                    });
                }else{
                    reData[1].children.push({
                        id:row.id,
                        text:row.name+' '+row.year+' | '+row.license_plate,
                        disabled:"disabled"
                    });
                }
            })
            modal.find('.cars-select').select2({
                data: reData,
                placeholder: "Pilih Kendaraan",
            })
            modal.find('.cars-select').on('select2:select', function (evt) {
                getCarsPricing($(this).val(), function(data, err){
                    modal.find('.area-select').html('<option></option>');
                    $.each(data, function(index, row){
                        data[index].text = row.destination+' | '+row.price
                    })
                    modal.find('.area-select').select2({
                        data: data,
                        placeholder: "Pilih Area Tujuan",
                    })
                    reDest = [];
                })
                modal.find('.area-select').on('select2:select', function (evt) {
                    getCarsPricing(modal.find('.cars-select').val(), $(this).val(), function(data, err){
                        modal.find('[name="initial_charge"]').val(data.price)
                    })
                })
            });
        })
        modal.find('[name="departure"]').on('change', function(){
            modal.find('[name="arival"]').removeAttr('disabled')
        })
        modal.find('[name="arival"]').on('change', function(){
            var departure = moment( modal.find('[name="departure"]').val(), "DD-MMMM-YYYY HH:mm", 'id');
            var arival = moment($(this).val(), "DD-MMMM-YYYY HH:mm", 'id');
            modal.find('[name="days"]').val(arival.diff(departure, 'days'))
            getCarsPricing(modal.find('.cars-select').val(), modal.find('.area-select').val(), function(data, err){
                var price = parseInt(data.price)
                var days = parseFloat(arival.diff(departure, 'days', true))
                var total = price * days
                modal.find('[name="total"]').val(Math.ceil(total));
            })
        })
        modal.find('[name="extra_charge"]').on('keyup', function(){
            var price = modal.find('[name="initial_charge"]').val()
            var days = modal.find('[name="days"]').val()
            var extra = !$(this).val() ? 0 : $(this).val()
            var total = modal.find('[name="total"]').val(Math.ceil((parseInt(price)*parseFloat(days))+parseInt(extra)))
        })
        getDriver(function(data, err){
            var reData = [{
                text: 'Tersedia Saat Ini',
                children: []
            },{
                text: 'Tidak Tersedia Saat Ini',
                children: []
            }];
            $.each(data, function(index, row){
                if(row.status == 1){
                    reData[0].children.push({
                        id:row.id,
                        text:row.name+' | '+row.tel
                    })
                }else{
                    reData[1].children.push({
                        id:row.id,
                        text:row.name+' | '+row.tel,
                        disabled: "disabled"
                    })
                }
            })
            modal.find('.driver-select').select2({
                data: reData,
                placeholder: "Pilih Pengemudi",
            })
        })
        modal.find('.btn-confirm-add').unbind('click')
        modal.find('.btn-confirm-add').on('click', function(){
            var queryData = modal.find('form').serializeJSON()
//            modal.find('form').ajaxForm()
            modal.find('form').clearForm();
            console.log(queryData)
            getCars(queryData.cars, function(cars, err){
                getCarsPricing(cars.id, queryData.area, function(pricing, err){
                    ordersDetailTable.row.add([
                        '<span class="identifier" data-cart=\''+JSON.stringify(queryData)+'\'>'+(counter+1)+'</span>',
                        cars.name,
                        cars.license_plate,
                        pricing.destination,
                        queryData.departure,
                        queryData.arival,
                        queryData.days,
                        queryData.initial_charge,
                        queryData.extra_charge,
                        '<button type="button" class="btn btn-danger rent-table-delete"><i class="icon mdi mdi-delete"></i></button>'
                    ]).draw()
                })
            })
        })
    })

    ordersDetailTable.on('draw.dt', function(){
        $('.invoice-details tbody').html('')
        var subtotal = 0
        var extra = 0
        var total = 0
        ordersDetailTable.rows().every(function(rowIdx, tableLoop, rowLoop){
            var node = this.node()
            var queryData = $(node).find('.identifier').data('cart');
            var data = this.data()
            $('.invoice-details tbody').append(
                '<tr><td class="description">'+data[1]+' | '+data[2]+' Tgl '+moment(data[4], "DD-MMMM-YYYY HH:mm", 'id').format('D MMM')+' - '+moment(data[5], "DD-MMMM-YYYY HH:mm", 'id').format('D MMM YYYY')+'</td>'+
                '<td class="amount price autoRupiah">'+data[7]+'</td>'+
                '<td class="hours">'+data[6]+'</td>'+
                '<td class="amount total-amount autoRupiah">'+parseInt(data[7])*parseFloat(data[6])+'</td></tr>'
            )
            subtotal = subtotal+parseInt(data[7])*parseFloat(data[6])
            extra = extra+parseInt(data[8])
            total = total+(subtotal+extra)
            $('.invoice-details tfoot .subtotal-value').html(subtotal)
            $('.invoice-details tfoot .extra-value').html(extra)
            $('.invoice-details tfoot .total-value').html(total)
        })
        $('.autoRupiah').autoNumeric("init", {
            digitGroupSeparator: '.',
            decimalCharacter: ',',
            currencySymbol: 'Rp '
        });
    });
    $('#rent-cars-table').on('click', '.rent-table-delete', function(){
        var parent = $(this).parent().parent();
        ordersDetailTable.row(parent).remove().draw();
    })
    $('.btn-order-save').on('click', function(){
        var orderData = $('#form-new-order').serializeJSON();
        var queryData = {
            admin_id:1,
            number:ordersNumber,
            name:orderData.name,
            tel:orderData.tel,
            address:orderData.address,
            notes:$('[name="notes"]').val()
        }
        setOrders(queryData, function(id, err){
            if(err == null){
                ordersDetailTable.rows().every(function(rowIdx, tableLoop, rowLoop){
                    var node = this.node()
                    var queryData = $(node).find('.identifier').data('cart');
                    var orderQueryData = {
                        order_id: id,
                        pricing_id: queryData.area,
                        driver_id: queryData.driver,
                        destination: queryData.destination,
                        departure: queryData.departure,
                        arival: queryData.arival,
                        initial_charges: parseInt(queryData.initial_charge)*parseFloat(queryData.days),
                        extra_charges: queryData.extra_charge,
                        total_charges: (parseInt(queryData.initial_charge)*parseFloat(queryData.days))+parseInt(queryData.extra_charge),
                    }
                    setOrdersDetails(orderQueryData, function(res, err){
                        if(err == null){
                            pageRender('rent/list.html', {id:id})
                        }else{
                            console.log(err);
                        }
                    })
                })
            }else{
                console.log(err);
            }
        })
    })
}

function ListOrdersPage(){
    getOrders(function(data, err){
        var orders = []
        $.each(data, function(i, v){
            getOrdersDetail(v.id, function(res, err){
                data[i].cars = res.length
            })
        })
        console.log(data)
        var orderTable = $('#rent-table').DataTable({
            "data" : data,
            "columns" : [
                {
                    "data": "id",
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                { "data": "number" },
                { "data": "name" },
                { "data": "tel" },
                { "data": "address" },
//                { "data": "cars" },
                {
                    "data": "id",
                    "render":function(id){
                        return '<div class="btn-group btn-space">'+
                            '<a href="rent/invoice.html" type="button" class="btn btn-default btn-evernote car-table-edit page-link" data-param='+JSON.stringify({ id:id })+'><i class="icon mdi mdi-money-box text-success"></i></a>'+
//                            '<a href="cars/edit.html" type="button" class="btn btn-default car-table-edit page-link" data-param='+JSON.stringify({ id:id })+'><i class="icon mdi mdi-edit"></i></a>'+
//                            '<button type="button" data-toggle="modal" data-target="#mod-car-delete" class="btn btn-danger car-table-delete" data-id="'+id+'"><i class="icon mdi mdi-delete"></i></button>'+
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
}

function invoicePage(id){
    $(document).ready(function(){

        $('.autoRupiah').autoNumeric("init", {
            digitGroupSeparator: '.',
            decimalCharacter: ',',
            currencySymbol: 'Rp '
        });
    })
    getOrders(id, function(dataOrders, err){
        $('.invoice-id').html('Invoice #'+dataOrders.number);
        var date = dataOrders.number.split("/")
        $('.incoice-date').html(moment(date[0], "X").format('DD MMMM YYYY'))
        $('.invoice-person .name').html(dataOrders.name)
        $('.invoice-person .address').html(dataOrders.address)
        $('.invoice-person .tel').html(dataOrders.tel)
        $('.invoice-details tbody').html('');
        getOrdersDetail(id, function(dataDetail, err){
            var subtotal = 0
            var extra = 0
            var total = 0
            $.each(dataDetail, function(i, val){
                getPricing(val.pricing_id, function(dataPricing, err){
                    getCars(dataPricing.car_id, function(dataCars, err){
                        $('.invoice-details tbody').append(
                            '<tr><td class="description">'+ dataCars.name +' | '+dataCars.license_plate+' Tgl '+moment(val.departure, "DD-MMMM-YYYY HH:mm", 'id').format('D MMM')+' - '+moment(val.arival, "DD-MMMM-YYYY HH:mm", 'id').format('D MMM YYYY')+'</td>'+
                            '<td class="amount price autoRupiah">'+ dataPricing.price +'</td>'+
                            '<td class="hours">'+moment(val.arival, "DD-MMMM-YYYY HH:mm", 'id').diff(moment(val.departure, "DD-MMMM-YYYY HH:mm", 'id'), 'days', true)+'</td>'+
                            '<td class="amount total-amount autoRupiah">'+moment(val.arival, "DD-MMMM-YYYY HH:mm", 'id').diff(moment(val.departure, "DD-MMMM-YYYY HH:mm", 'id'), 'days', true)*dataPricing.price+'</td><tr>'
                        )
                        subtotal = subtotal+parseInt(val.initial_charges)
                        extra = extra+parseInt(val.extra_charges)
                        total = total+(subtotal+extra)
                        $('.invoice-details tfoot .subtotal-value').html(subtotal)
                        $('.invoice-details tfoot .extra-value').html(extra)
                        $('.invoice-details tfoot .total-value').html(total)
                        $('.autoRupiah').autoNumeric("init", {
                            digitGroupSeparator: '.',
                            decimalCharacter: ',',
                            currencySymbol: 'Rp '
                        });
                        $('.autoRupiah').autoNumeric("update", {
                            digitGroupSeparator: '.',
                            decimalCharacter: ',',
                            currencySymbol: 'Rp '
                        });
                    })
                })

            })
        })
    })
}
