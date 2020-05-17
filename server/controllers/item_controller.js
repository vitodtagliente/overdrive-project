const Controller = require('overdrive').Controller;
const CRUD = require('overdrive').CRUD;
const ItemProvider = require('data').Providers.ItemProvider;

class ItemController extends Controller {
    /// Register the controller routes
    /// @param router - The router
    register(router) {
        CRUD.register(router, ItemProvider, '/api/items');
    }
}

module.exports = ItemController;