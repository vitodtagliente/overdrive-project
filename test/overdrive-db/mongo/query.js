const mongoose = require('mongoose');
const Query = require('../query');

class MongoQuery extends Query {
    constructor(context) {
        super(context);
    }

    static isValidId(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }

    async all(search) {
        return await this.context.find({});
    }

    async find(search) {
        return await this.context.find(search);
    }

    async findOne(search) {
        return await this.context.findOne(search);
    }

    async findById(id) {
        if (MongoQuery.isValidId(id))
        {
            try 
            {
                return await this.context.findById(id);
            }
            catch (err)
            {
                console.error(err);
            }
        }
        return null;
    }

    async findByIds(ids = Array(), separator = ',') {
        if (typeof ids === "string")
        {
            ids = ids.split(separator).map(id => id.trim());
        }

        let idsToFind = Array();
        for (const id of ids)
        {
            if (MongoQuery.isValidId(id))
            {
                idsToFind.push(id);
            }
            else 
            {
                console.error(`'${id}' is not a valid Model.Id!`)
            }
        }

        if (idsToFind.length == 0)
        {
            return [];
        }

        try 
        {
            return await this.context.find({
                _id: {
                    $in: idsToFind
                }
            });
        }
        catch (err)
        {
            console.error(err);
        }
        return [];
    }

    async count() {
        return 0;
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