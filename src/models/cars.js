function getCars(arg1, arg2) {
    db.serialize(function () {
        if (Object.prototype.toString.call(arg1) == "[object Function]") {
            db.all("SELECT * from cars where deleted = '0' ", function (err, row) {
                arg1(row, err);
            });
        } else {
            db.get("SELECT * from cars where id='" + arg1 + "'", function (err, row) {
                arg2(row, err);
            });
        }
    });
}

function setCars(arg1, arg2, arg3){
    db.serialize(function () {
        if (Object.prototype.toString.call(arg2) == "[object Function]") {
            db.run(
                "insert into cars(type, name, year, fuel, license_plate, ownership) values($type, $name, $year, $fuel, $license_plate, $ownership)", {
                    $type: arg1.type,
                    $name: arg1.name,
                    $year: arg1.year,
                    $fuel: arg1.fuel,
                    $license_plate: arg1.license_plate,
                    $ownership: arg1.ownership,
                }, function (err) {
                    arg2(this.lastID, err);
                }
            );
        } else if(Object.prototype.toString.call(arg3) == "[object Function]") {
            db.run(
                "update cars set type = $type, name = $name, year = $year, fuel = $fuel, license_plate = $license_plate, ownership = $ownership where id = $id", {
                    $type: arg2.type,
                    $name: arg2.name,
                    $year: arg2.year,
                    $fuel: arg2.fuel,
                    $license_plate: arg2.license_plate,
                    $ownership: arg2.ownership,
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

function deleteCars(arg1, arg2){
    db.run(
        "update cars set deleted = $deleted where id = $id", {
            $deleted: 1,
            $id: arg1,
        }, function (err) {
            arg2(this.changes, err);
        }
    );
}

function getCarsPricing(arg1, arg2, arg3){
    db.serialize(function () {
        if (Object.prototype.toString.call(arg2) == "[object Function]") {
            db.all("SELECT * from pricing where car_id = '" + arg1 + "' and deleted = '0' ", function (err, row) {
                arg2(row, err);
            });
        } else {
            db.get("SELECT * from pricing where id='" + arg2 + "' and car_id='" + arg1 + "'", function (err, row) {
                arg3(row, err);
            });
        }
    });
}

function setCarsPricing(arg1, arg2, arg3){
    db.serialize(function () {
        if (Object.prototype.toString.call(arg2) == "[object Function]") {
            db.run("insert into pricing(car_id, destination, price) values($car_id, $destination, $price)", {
                $car_id:arg1.car_id,
                $destination:arg1.destination,
                $price:arg1.price,
            }, function (err) {
                arg2(this.changes, err);
            });
        } else {
            db.run(
                "update pricing set destination = $destination, price = $price where id = $id", {
                    $destination:arg2.destination,
                    $price:arg2.price,
                    $id: arg1,
                }, function (err) {
                    arg3(this.changes, err);
                }
            );
        }
    });
}

function deleteCarsPricing(arg1, arg2){
    db.run(
        "update pricing set deleted = $deleted where id = $id", {
            $deleted: 1,
            $id: arg1,
        }, function (err) {
            arg2(this.changes, err);
        }
    );
}
