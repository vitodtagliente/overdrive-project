const mongoose = require('mongoose');
const Query = require('../query');

class MongoQuery extends Query {
    constructor(context) {
        super(context);
    }

    static isValidId(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }

    /// Check if a type is a derived one
    /// @param derived - The derived type
    /// @param parent - The parent type
    /// @return - True if the inherarchy is verified
    static isSubclassOf(derived, parent) {
        return (derived.prototype instanceof parent || derived === parent);
    }

    async all() {
        return await this.context.find({});
    }

    async count(condition) {
        return await this.context.countDocuments(condition || {});
    }

    async find(condition, search) {
        return await this.context.find(condition, null, search);
    }

    async findOne(condition) {
        return await this.context.findOne(condition);
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

    async deleteById(id) {
        if (MongoQuery.isValidId(id))
        {
            const result = await this.context.deleteOne({ _id: id });
            return result.ok == true
                && result.n == result.deletedCount
                && result.deletedCount > 0;
        }
        return false;
    }

    async deleteByIds(ids = Array(), separator = ',') {
        if (typeof ids === "string")
        {
            ids = ids.split(separator).map(id => id.trim());
        }

        let idsToFind = Array();
        for (const id of ids)
        {
            if (Model.Id.isValid(id))
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
            return false;
        }

        try 
        {
            const result = await this.context.deleteMany({
                _id: {
                    $in: idsToFind
                }
            });
            return result.ok == true
                && result.n == result.deletedCount
                && result.deletedCount > 0;
        }
        catch (err)
        {
            console.error(err);
        }
        return false;
    }
}

module.exports = MongoQuery;