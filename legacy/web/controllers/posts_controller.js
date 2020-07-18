const Controller = require('overdrive').Controller;
const dashboard = require('../dashboard/dashboard').instance;
const Post = require('data').Models.Post;

class PostsController extends Controller {
    /// Restrieve the test dashboard module
    static async home(req, res) {
        res.dashboard('dashboards/posts');
    }

    static async edit(req, res) {
        const post = await Post.findById(req.params.id);
        res.dashboard('dashboards/post_editor', { post });
    }
    /// Register the controller routes
    /// @param router - The router
    register(router) {
        // register the routes
        router.get('/posts', PostsController.home);
        router.get('/posts/:id', PostsController.edit);

        // register the navigation
        dashboard.sidebar.add('Posts', 'file').setUrl('/posts');
    }
}

module.exports = PostsController;