const Controller = require('overdrive').Controller;
const dashboard = require('../dashboard/dashboard').instance;

class ComponentsController extends Controller {
    /// Restrieve the test dashboard module
    static async home(req, res) {
        res.dashboard('dashboards/components');
    }

    static async edit(req, res) {
        const article = await Article.findById(req.params.id);
        res.dashboard('dashboards/article_editor', { article });
    }
    /// Register the controller routes
    /// @param router - The router
    register(router) {
        // register the routes
        router.get('/articles', ComponentsController.home);
        router.get('/articles/:id', ComponentsController.edit);

        // register the navigation
        dashboard.sidebar.add('Articles', 'file').setUrl('/articles');
    }
}

module.exports = ComponentsController;