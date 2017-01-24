function setOrders(arg1, arg2, arg3){
    db.serialize(function () {
        if (Object.prototype.toString.call(arg2) == "[object Function]") {
            db.run(
                "insert into orders(admin_id, number, name, tel, address, notes) values($admin_id, $number, $name, $tel, $address, $notes)", {
                    $admin_id: arg1.admin_id,
                    $number: arg1.number,
                    $name: arg1.name,
                    $tel: arg1.tel,
                    $address: arg1.address,
                    $notes: arg1.notes,
                }, function (err) {
                    arg2(this.lastID, err);
                }
            );
        } else if(Object.prototype.toString.call(arg3) == "[object Function]") {
            db.run(
                "update orders set name=$name, tel=$tel, address=$address, notes=$notes where id = $id", {
                    $name: arg2.name,
                    $tel: arg2.tel,
                    $address: arg2.address,
                    $notes: arg2.notes,
                    $id: arg1,
                }, function (err) {
                    arg3(this.changes, err);
                }
            );
        }else{
            arg1(null, 'atleast 2 parameter')
        }
    });
}
function setOrdersDetails(arg1, arg2, arg3){
    db.serialize(function () {
        if (Object.prototype.toString.call(arg2) == "[object Function]") {
            db.run(
                "insert into "+
                "order_detail(order_id, pricing_id, driver_id, destination, departure, arival, initial_charges, extra_charges, total_charges)"+
                "values($order_id, $pricing_id, $driver_id, $destination, $departure, $arival, $initial_charges, $extra_charges, $total_charges)", {
                    $order_id:arg1.order_id,
                    $pricing_id:arg1.pricing_id,
                    $driver_id:arg1.driver_id,
                    $destination:arg1.destination,
                    $departure:arg1.departure,
                    $arival:arg1.arival,
                    $initial_charges:arg1.initial_charges,
                    $extra_charges:arg1.extra_charges,
                    $total_charges:arg1.total_charges,
                }, function (err) {
                    arg2(this.lastID, err);
                }
            );
        } else if(Object.prototype.toString.call(arg3) == "[object Function]") {
//            db.run(
//                "update orders set name=$name, tel=$tel, address=$address, notes=$notes where id = $id", {
//                    $name: arg2.name,
//                    $tel: arg2.tel,
//                    $address: arg2.address,
//                    $notes: arg2.notes,
//                    $id: arg1,
//                }, function (err) {
//                    arg3(this.changes, err);
//                }
//            );
        }else{
            arg1(null, 'atleast 2 parameter')
        }
    });
}

function getOrders(arg1, arg2) {
    db.serialize(function () {
        if (Object.prototype.toString.call(arg1) == "[object Function]") {
            db.all("SELECT * from orders where deleted = '0' ", function (err, row) {
                arg1(row, err);
            });
        } else {
            db.get("SELECT * from orders where id='" + arg1 + "'", function (err, row) {
                arg2(row, err);
            });
        }
    });
}

function getOrdersDetail(arg1, arg2, arg3){
    db.serialize(function () {
        if (Object.prototype.toString.call(arg2) == "[object Function]") {
            db.all("SELECT * from order_detail where order_id='"+arg1+"' and deleted = '0' ", function (err, row) {
                arg2(row, err);
            });
        } else if(Object.prototype.toString.call(arg3) == "[object Function]") {
            db.get("SELECT * from order_detail where id='"+arg1+"' order_id='" + arg2 + "'", function (err, row) {
                arg3(row, err);
            });
        } else {
            db.get("SELECT * from order_detail where deleted = '0' ", function (err, row) {
                arg1(row, err);
            });
        }
    });
}
