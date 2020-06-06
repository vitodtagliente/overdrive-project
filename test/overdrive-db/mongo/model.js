const Connection = require('../connection');
const Model = require('../model');
const Query = require('./query');

class MongoModel extends Model {
    constructor(raw) {
        super(Connection.Type.MongoDB, raw, new Query(raw));
    }
}