const Controller = require('overdrive').Controller;
const CRUD = require('overdrive').CRUD;
const User = require('data').Models.User;

class UserController extends Controller {
    /// Register the controller routes
    /// @param router - The router
    register(router) {
        /// Retrieve the list of all the users
        CRUD.read(router, User, '/users');
    }
}

module.exports = UserController;