const Controller = require('overdrive').Controller;

class HomeController extends Controller {
    /// Serve the placeholder home page
    /// @param req - The http request
    /// @param res - The http response
    static async home(req, res) {
        res.send("<h1>Welcome to overdrive!</h1>");
    }

    static async test(req, res) {
        res.render('test');
    }

    static async admin(req, res) {
        res.render('dashboard');
    }

    /// Register the controller routes
    /// @param router - The router
    register(router) {
        router.get('/', HomeController.home);
        router.get('/test', HomeController.test);
        router.get('/admin', HomeController.admin);
    }
};

module.exports = HomeController;