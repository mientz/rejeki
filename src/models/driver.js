function getDriver(arg1, arg2) {
    db.serialize(function () {
        if (Object.prototype.toString.call(arg1) == "[object Function]") {
            db.all("SELECT * from driver where deleted = '0' ", function (err, row) {
                arg1(row, err);
            });
        } else {
            db.get("SELECT * from driver where id='" + arg1 + "'", function (err, row) {
                arg2(row, err);
            });
        }
    });
}

function setDriver(arg1, arg2, arg3){
    db.serialize(function () {
        if (Object.prototype.toString.call(arg2) == "[object Function]") {
            db.run(
                "insert into driver(name, tel, address, license) values($name, $tel, $address, $license)", {
                    $name: arg1.name,
                    $tel: arg1.tel,
                    $address: arg1.address,
                    $license: arg1.license,
                }, function (err) {
                    arg2(this.lastID, err);
                }
            );
        } else if(Object.prototype.toString.call(arg3) == "[object Function]") {
            db.run(
                "update driver set name=$name, tel=$tel, address=$address, license=$license where id = $id", {
                    $name: arg2.name,
                    $tel: arg2.tel,
                    $address: arg2.address,
                    $license: arg2.license,
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

function deleteDriver(arg1, arg2){
    db.run(
        "update driver set deleted = $deleted where id = $id", {
            $deleted: 1,
            $id: arg1,
        }, function (err) {
            arg2(this.changes, err);
        }
    );
}
