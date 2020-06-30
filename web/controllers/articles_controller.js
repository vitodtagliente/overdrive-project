const Controller = require('overdrive').Controller;
const dashboard = require('../dashboard/dashboard').instance;
const Article = require('data').Models.Article;

class ArticlesController extends Controller {
    /// Restrieve the test dashboard module
    static async home(req, res) {
        res.dashboard('dashboards/articles');
    }

    static async edit(req, res) {
        const article = await Article.findById(req.params.id);
        res.dashboard('dashboards/article_editor', { article });
    }
    /// Register the controller routes
    /// @param router - The router
    register(router) {
        // register the routes
        router.get('/articles', ArticlesController.home);
        router.get('/articles/:id', ArticlesController.edit);

        // register the navigation
        dashboard.sidebar.add('Articles', 'file').setUrl('/articles');
    }
}

module.exports = ArticlesController;