const mongoose = require('mongoose');
const Query = require('../query');

class MongoQuery extends Query {
    /// constructor
    /// @param context - The context
    constructor(context) {
        super(context);
    }

    /// Check if an id is valid
    /// @param id - The id to verify
    /// @return - True if valid
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

    /// Retrieve all the records
    /// @return - The list of records
    async all() {
        return await this.context.find({});
    }

    /// Retrive the number of records
    /// @param condition - The condition
    /// @return - The count
    async count(condition) {
        return await this.context.countDocuments(condition || {});
    }

    /// Find records
    /// @param condition - The condition
    /// @param search - The search options
    /// @return - The list of records that match the search
    async find(condition, search) {
        return await this.context.find(condition, null, search);
    }

    /// Find one record
    /// @param condition - The condition
    /// òreturn - The record if exists
    async findOne(condition) {
        return await this.context.findOne(condition);
    }

    /// Find a record by id
    /// @param id - The id
    /// @return - The record if exists
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

    /// Find records by ids
    /// @param ids - the set of ids
    /// @return -  The list of records if exist
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
                console.error(`'${id}' is not a valid mongo Id!`);
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

    /// Insert a new record into the database
    /// @param data - The data of the new record
    /// @return - The created record is succeed
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

    /// Delete a record by id
    /// @param id - The id
    /// @return - True if succeed
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

    /// Delete records by ids
    /// @param ids - The list of ids
    /// @param separator - The separator character if ids is a string
    /// @return - True if succeed
    async deleteByIds(ids = Array(), separator = ',') {
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
                console.error(`'${id}' is not a valid mongo Id!`);
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

    /// Update by id
    /// @param id - The id of the record to update
    /// @param data - The fields to update
    /// @return - True if succeed
    async update(id, data) {
        if (MongoQuery.isValidId(id))
        {
            const result = await this.context.updateOne(
                { _id: id },
                data
            );
            return result.ok == true;
        }
        console.error(`'${id}' is not a valid mongo Id!`);
        return null;
    }
}

module.exports = MongoQuery;