const Controller = require('overdrive').Controller;
const CRUD = require('overdrive').CRUD;
const Page = require('data').Models.Page;

class PagesController extends Controller {
    /// Register the controller routes
    /// @param router - The router
    register(router) {
        const route = '/api/pages';

        CRUD.register(router, Page, route);
    }
}

module.exports = PagesController;