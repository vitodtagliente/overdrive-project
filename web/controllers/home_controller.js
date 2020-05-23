const Controller = require('overdrive').Controller;

class HomeController extends Controller {
    /// Serve the placeholder home page
    /// @param req - The http request
    /// @param res - The http response
    static async home(req, res) {
        res.send("<h1>Welcome to overdrive!</h1>");
    }

    /// Register the controller routes
    /// @param router - The router
    register(router) {
        router.get('/', HomeController.home);
    }
};

module.exports = HomeController;