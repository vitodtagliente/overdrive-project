const DataProvider = require('mango').DataProvider;
const Item = require('../models/item_model');
const Errors = require('overdrive').Errors;
const Logger = require('overdrive').Logger;

class ItemProvider extends DataProvider {
    /// constructor
    constructor() {
        super(Item);
    }


};

module.exports = ItemProvider;
