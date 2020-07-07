exports.Models = {
    Item: require('./models/item_model'),
    Post: require('./models/post_model'),
    User: require('./models/user_model')
};

exports.Seeds = [
    require('./seeds/user_seeds'),
    require('./seeds/item_seeds')
];