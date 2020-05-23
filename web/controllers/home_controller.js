const Controller = require('overdrive').Controller;
const Dashboard = require('../dashboard/dashboard');

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
        const dashboard = new Dashboard();
        const sidebar = dashboard.sidebar;
        sidebar.add("Dashboard", 'tachometer-alt');
        sidebar.add("Events", 'chart-line');
        const userMenu = sidebar.add("Users", 'user');
        userMenu.add('Add new', 'add', '#');
        userMenu.add('Privileges', 'folder');
        sidebar.add("Foo", 'folder').setSection("Zeta");
        sidebar.add("Foo", 'folder').setSection('General');
        //foo.add('ex1', '', '/ppp');
        //foo.add('ex2', '', '/ppp');
        res.render('dashboard', { dashboard });
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