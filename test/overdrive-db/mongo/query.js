const Query = require('../query');

class MongoQuery extends Query {
    constructor(model){
        super(model);
    }

    async all(search){
        return await this.model.find({});
    }    

    async find(search){
        return null;
    }
}

module.exports = MongoQuery;