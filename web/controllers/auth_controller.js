const Controller = require('overdrive').Controller;
const Session = require('overdrive').Session;

class AuthController extends Controller {
    /// Serve the sign-in page
    /// @param req - The http request
    /// @param res - The http response
    static async signin(req, res) {
        const session = new Session(req);
        if (session.user)
        {
            res.render('overdrive/leavesession', session.user);
        }
        else 
        {
            res.render('overdrive/signin', { signin: true });
        }
    }

    /// Serve the sign-up page
    /// @param req - The http request
    /// @param res - The http response
    static async signup(req, res) {
        res.render('overdrive/signin', { signin: false });
    }

    /// Register the controller routes
    /// @param router - The router
    register(router) {
        router.get('/signin', AuthController.signin);
        router.get('/signup', AuthController.signup);
    }
};

module.exports = AuthController;