const Query = require('../query');

class MongoQuery extends Query {
    constructor(model){
        super(model);
    }

    async all(search){
        return [];
    }    

    async find(search){
        return null;
    }
}

module.exports = MongoQuery;