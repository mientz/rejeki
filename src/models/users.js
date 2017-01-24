function getUser(id, callback) {
    db.serialize(function () {
        if (arguments.length == 1) {
            db.all("SELECT * from admin", function (err, row) {
                callback(row);
            });
        } else {
            db.get("SELECT * from admin where id='" + id + "'", function (err, row) {
                callback(row);
            });
        }
    });
}

function authUser(username, password, callback){
    db.serialize(function () {
        if (arguments.length == 2) {
            callback(false, 'Mohon isi semua inputan');
        } else {
            db.get("SELECT * from admin where username='" + username + "' and password='" + password + "'", function (err, row) {
                if(typeof(row) == 'undefined'){
                    callback(false, 'Username dan password tidak tercatat pada aplikasi');
                }else{
                    callback(true, row);
                }
            });
        }
    });
}
