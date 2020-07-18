const Controller = require('overdrive').Controller;
const dashboard = require('../dashboard/dashboard').instance;

class TestController extends Controller {
    /// Restrieve the test dashboard module
    static async home(req, res){
        res.dashboard('dashboards/test');
    }

    /// Restrieve the test dashboard module
    static async foo(req, res){
        res.render('foo');
    }

    /// Register the controller routes
    /// @param router - The router
    register(router) {
        // register the routes
        router.get('/test', TestController.home);
        router.get('/foo', TestController.foo);

        // register the navigation
        dashboard.sidebar.add('Test', 'folder').setUrl('/test');
    }
}

module.exports = TestController;