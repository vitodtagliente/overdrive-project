const Controller = require('overdrive').Controller;
const dashboard = require('../dashboard/dashboard').instance;
const Page = require('data').Models.Page;

class PagesController extends Controller {
    /// Restrieve the test dashboard module
    static async home(req, res) {
        res.dashboard('dashboards/pages');
    }

    static async edit(req, res) {
        const page = await Page.findById(req.params.id);
        res.dashboard('dashboards/page_editor', { page });
    }
    /// Register the controller routes
    /// @param router - The router
    register(router) {
        // register the routes
        router.get('/pages', PagesController.home);
        router.get('/pages/:id', PagesController.edit);

        // register the navigation
        dashboard.sidebar.add('Pages', 'file').setUrl('/pages');
    }
}

module.exports = PagesController;