window.addEventListener('load', function () {

    function swap(signin = true) {
        //document.getElementById(signin ? 'row-signup' : 'row-signin').classList.add('d-none');
        //document.getElementById(signin ? 'row-signin' : 'row-signup').classList.remove('d-none');
        if (signin)
        {
            $('#content').removeClass('active');
        }
        else
        {
            $('#content').addClass('active');
        }
        document.title = signin ? 'Sign In' : 'Sign Up';
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
        const registeredEmail = $('#up-email').val();

        $.post({
            url: '/api/auth/signup',
            data: data,
        }).done(function (data) {
            const email = $('#in-email');
            email.popover({
                title: 'Sign up completed!',
                delay: 5000
            });
            email.val(registeredEmail);
            swap();
        }).fail(function (data) {

        });
    });
});