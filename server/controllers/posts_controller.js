const Controller = require('overdrive').Controller;
const CRUD = require('overdrive').CRUD;
const Post = require('data').Models.Post;

class PostsController extends Controller {
    /// Register the controller routes
    /// @param router - The router
    register(router) {
        const route = '/api/posts';

        CRUD.register(router, Post, route);
    }
}

module.exports = PostsController;