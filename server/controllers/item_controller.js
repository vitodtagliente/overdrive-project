const Controller = require('overdrive').Controller;
const CRUD = require('overdrive').CRUD;
const Item = require('data').Models.Item;

class ItemController extends Controller {
    /// Register the controller routes
    /// @param router - The router
    register(router) {
        CRUD.register(router, Item, '/api/items');
    }
}

module.exports = ItemController;