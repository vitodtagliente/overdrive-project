window.addEventListener('load', function () {

    function swap(signin = true) {
        document.getElementById(signin ? 'row-signup' : 'row-signin').classList.add('d-none');
        document.getElementById(signin ? 'row-signin' : 'row-signup').classList.remove('d-none');
    }

    $('#signIn').on('click', function () {
        swap();
    });
    $('#signUp').on('click', function () {
        swap(false);
    });

    $("#form-signin").on("submit", function (e) {
        e.preventDefault();

        $.post({
            url: '/api/auth/signin',
            data: $("#form-signin").serialize(),
        }).done(function (data) {
            window.location.replace("/");
        }).fail(function (data) {

        });
    });

    $("#form-signup").on("submit", function (e) {
        e.preventDefault();

        const data = $("#form-signup").serialize();

        $.post({
            url: '/api/auth/signup',
            data: data,
        }).done(function (data) {
            swap();
        }).fail(function (data) {

        });
    });
});