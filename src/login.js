$(document).ready(function(){
    if(localStorage.remember != '' && localStorage.remember != null && typeof(localStorage.remember) != 'undefined'){
        location.replace('index.html');
    }else{
        localStorage.clear();
    }
    $('form#form-login').submit(function(e) {
        e.preventDefault();
        var username = $(this).find(':text').fieldValue();
        var password = $(this).find(':password').fieldValue();
        var remember = $(this).find(':checkbox').fieldValue();
        authUser(username, password, function(status, data){
            if(status){
                $.gritter.add({
                    title: 'Selamat datang '+data.realname,
                    text: "Tunggu sesaat. Aplikasi sedang mempersiapkan",
                    image: App.conf.assetsPath + '/' +  App.conf.imgPath + '/' + data.image,
                    time: '',
                    class_name: 'img-rounded'
                });
                setTimeout(function() {
                    localStorage.userId = data.id;
                    if(remember == 'on'){
                        localStorage.remember = true;
                        location.replace('index.html');
                    }
                }, 1000);
            }else{
                $.gritter.add({
                    title: 'Danger',
                    text: data,
                    class_name: 'color danger'
                });
            }
        })
    });
});
