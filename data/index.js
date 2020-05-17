const DataProvider = require('mango').DataProvider;

exports.Models = {
    Item: require('./models/item_model'),
    User: require('./models/user_model')
};

exports.Providers = {
    ItemProvider: new (require('./providers/item_provider'))(),
    UserProvider: new (require('./providers/user_provider'))()
};

exports.Seeds = [
    require('./seeds/user_seeds'),
    require('./seeds/item_seeds')
];