const Controller = require('overdrive').Controller;
const dashboard = require('../dashboard/dashboard').instance;

class ArticlesController extends Controller {
    /// Restrieve the test dashboard module
    static async home(req, res){
        res.dashboard('dashboards/test');
    }
    /// Register the controller routes
    /// @param router - The router
    register(router) {
        // register the routes
        router.get('/articles', ArticlesController.home);

        // register the navigation
        dashboard.sidebar.add('Articles', 'file').setUrl('/articles');
    }
}

module.exports = ArticlesController;