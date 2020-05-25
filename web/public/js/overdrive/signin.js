window.addEventListener('load', function () {
    // animation setup
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    signUpButton.addEventListener('click', () => {
        container.classList.add('right-panel-active');
        document.title = "Sign up";
    });

    signInButton.addEventListener('click', () => {
        container.classList.remove('right-panel-active');
        document.title = "Sign in";
    });

    $("form-signin").on("submit", function (e) {
        e.preventDefault();

        $.post({
            url: '/api/auth/login',
            data: $('form').serialize(),
        }).done(function (data) {
            window.location.replace("/");
        }).fail(function (data) {

        });
    });
});