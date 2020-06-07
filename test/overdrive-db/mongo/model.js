const Connection = require('../connection');
const Model = require('../model');
const MongoQuery = require('./query');

class MongoModel extends Model {
    constructor(raw, definition) {
        super(Connection.Type.MongoDB, raw, definition, new MongoQuery(raw));
    }
}

module.exports = MongoModel;