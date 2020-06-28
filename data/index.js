exports.Models = {
    Item: require('./models/item_model'),
    User: require('./models/user_model'),
    Article: require('./models/article_model')
};

exports.Seeds = [
    require('./seeds/user_seeds'),
    require('./seeds/item_seeds')
];