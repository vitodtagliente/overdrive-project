const Query = require('../query');

class MongoQuery extends Query {
    constructor(context) {
        super(context);
    }

    async all(search) {
        return await this.context.find({});
    }

    async find(search) {
        return null;
    }

    async insert(data) {
        try
        {
            const model = new this.context(data);
            return await model.save();
        }
        catch (error)
        {
            console.log(error);
            return null;
        }
    }
}

module.exports = MongoQuery;