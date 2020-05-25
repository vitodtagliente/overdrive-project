const Controller = require('overdrive').Controller;
const dashboard = require('../dashboard/dashboard').instance;
const Session = require('overdrive').Session;

class HomeController extends Controller {
    /// Serve the placeholder home page
    /// @param req - The http request
    /// @param res - The http response
    static async home(req, res) {
        const session = new Session(req);
        if (session.user == null)
        {
            res.render('overdrive/home');
        }
        else 
        {
            res.dashboard('dashboards/home');
        }
    }

    /// Register the controller routes
    /// @param router - The router
    register(router) {
        router.get('/', HomeController.home);

        // register the navigation
        dashboard.sidebar.add('Dashboard', 'tachometer-alt').setUrl('/');
    }
};

module.exports = HomeController;