const Article = require('data').Models.Article;
const Controller = require('overdrive').Controller;
const Marked = require('marked');

class BlogController extends Controller {
    static async home(req, res) {
        res.send("Blog");
    }

    static async get(req, res) {
        const article = await Article.findById(req.params.id);
        res.render('overdrive/article', {
            article: Marked(article.content)
        });
    }
    /// Register the controller routes
    /// @param router - The router
    register(router) {
        router.get('/blog', BlogController.home);
        router.get('/blog/:id', BlogController.get);
    }
}

module.exports = BlogController;