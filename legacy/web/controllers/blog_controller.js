const Controller = require('overdrive').Controller;
const Marked = require('marked');
const Post = require('data').Models.Post;

class BlogController extends Controller {
    static async home(req, res) {
        res.send("Blog");
    }

    static async get(req, res) {
        const post = await Post.findById(req.params.id);
        res.render('overdrive/post', {
            post: Marked(post.content)
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