const Logger = require('overdrive-logger');
const Model = require('./model');
const Status = require('overdrive-status');

function respond(status = 200, data = null) {
    return {
        success: (status >= 200 && status < 300),
        data,
        status,
    };
}

class DataProvider {
    /// Constructor
    /// @param model - The model schema
    constructor(model) {
        console.assert(Model.isValid(model), `${model.name} is not a valid Model!`);
        this.Model = model;
    }

    /// Retrieve the model of a specified id
    /// @param id - The id of the model to find
    /// @return - The model, if it exists
    async get(id) {
        if (Model.Id.isValid(id))
        {
            try 
            {
                const model = await this.Model.findById(id);
                if (model != null)
                {
                    return respond(Status.Code.OK, model);
                }
                return responde(Status.Code.NotFound);
            }
            catch (err)
            {
                Logger.error(err);
                return respond(Status.Code.InternalServerError);
            }
        }
        return respond(Status.Code.BadRequest);
    }

    /// Retrieve all the records in the db
    /// @return - The list of records
    async getAll() {
        try 
        {
            const data = await this.Model.find({});
            return respond(Status.Code.OK, data);
        }
        catch (err)
        {
            Logger.error(err);
            return respond(Status.Code.InternalServerError);
        }
    }

    /// Retrieve the models of specified ids
    /// @param ids - The ids of the models to find
    /// @param separator - The separator character, ',' by default
    /// @return - The model list
    async getMany(ids = Array(), separator = ',') {
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
                Logger.error(`'${id}' is not a valid Model.Id!`)
            }
        }

        if (idsToFind.length == 0)
        {
            return respond(Status.Code.BadRequest);
        }

        try 
        {
            const data = await this.Model.find({
                _id: {
                    $in: idsToFind
                }
            });
            return respond(Status.Code.Ok, data);
        }
        catch (err)
        {
            Logger.error(err);
            return respond(Status.Code.InternalServerError);
        }
    }

    /// Find models
    /// @param search - The search params
    /// @return - The list of models that match the search
    async find(search) {
        const result = await this.Model.find(search);
        return respond(
            result.length > 0 ? Status.Code.OK : Status.Code.NotFound,
            result
        );
    }

    /// Find a model
    /// @param search - The search params
    /// @return - The model if exists
    async findOne(search) {
        const result = await this.Model.findOne(search);
        return respond(
            result != null ? Status.Code.OK : Status.Code.NotFound,
            result
        );
    }

    /// Create a new record to the db.
    /// @param data - The data of the model.
    /// @return - True if the record has been correctly created, false otherwise.
    async create(data) {
        try
        {
            const model = new this.Model(data);
            await model.save();
            return respond(Status.Code.Created, model);
        }
        catch (error)
        {
            Logger.error(`Cannot add a new record of type ${this.Model.name}! ${error}`);
            return respond(Status.Code.BadRequest);
        }
    }

    /// Remove an record from the db
    /// @param id - The id of the record to remove
    /// @return - true if succeed
    async remove(id) {
        if (Model.Id.isValid(id))
        {
            const result = await this.Model.deleteOne({ _id: id });
            const success = result.ok == true
                && result.n == result.deletedCount
                && result.deletedCount > 0;
            return respond(
                success ? Status.Code.Ok : Status.Code.BadRequest,
                { deleted: result.deletedCount }
            );
        }
        return respond(Status.Code.BadRequest);
    }

    /// Remove models of specified id
    /// @param ids - The list of ids
    /// @param separator - The separator character, ',' by default
    /// @return - True if succeed
    async removeMany(ids = Array(), separator = ',') {
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
                Logger.error(`'${id}' is not a valid Model.Id!`)
            }
        }

        if (idsToFind.length == 0)
        {
            return responde(Status.Code.BadRequest);
        }

        try 
        {
            const result = await this.Model.deleteMany({
                _id: {
                    $in: idsToFind
                }
            });
            const success = result.ok == true
                // && result.n == result.deletedCount
                && result.deletedCount > 0;
            return respond(
                success ? Status.Code.Ok : Status.Code.BadRequest,
                { deleted: result.deletedCount }
            );
        }
        catch (err)
        {
            Logger.error(err);
            return respond(Status.Code.InternalServerError);
        }
    }
};

module.exports = DataProvider;