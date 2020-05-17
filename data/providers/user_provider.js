const DataProvider = require('mango').DataProvider;
const User = require('../models/user_model');

class UserProvider extends DataProvider {
    /// constructor
    constructor() {
        super(User);
    }
};

module.exports = UserProvider;
