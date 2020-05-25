window.addEventListener('load', function () {
    // animation setup
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    function swap(signin = true) {
        if (signin)
        {
            container.classList.remove('right-panel-active');
            document.title = "Sign in";
        }
        else 
        {
            container.classList.add('right-panel-active');
            document.title = "Sign up";
        }
    }

    signUpButton.addEventListener('click', () => {
        swap(false);
    });

    signInButton.addEventListener('click', () => {
        swap();
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