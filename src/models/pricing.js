function getPricing(arg1, arg2){
    db.serialize(function () {
        if (Object.prototype.toString.call(arg1) == "[object Function]") {
            db.all("SELECT * from pricing where deleted = '0' ", function (err, row) {
                arg1(row, err);
            });
        } else {
            db.get("SELECT * from pricing where id='" + arg1 + "'", function (err, row) {
                arg2(row, err);
            });
        }
    });
}
