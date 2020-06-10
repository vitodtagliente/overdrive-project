const Connection = require('./connection');

class Schema {
    #name = null;
    #context = null;
    #definition = null;
    #queryType = null;
    #query = null;
    /// constructor
    /// @param name - The name of the schema
    /// @param definition - The definition
    /// @param context - The raw schema
    /// @param queryType - The type of query handler
    constructor(name, definition, context, queryType) {
        this.#definition = definition;
        this.#name = name;
        this.#context = context;
        this.#queryType = queryType;
        this.#query = new queryType(context);
    }

    /// Retrieve the name of the schema
    /// @return - The name
    get name() {
        return this.#name;
    }

    /// Retrieve the context of the schema
    /// @return - The context
    get context() {
        return this.#context;
    }

    /// Retrieve the definition of the schema
    /// @return - The definition
    get definition() {
        return this.#definition;
    }

    /// Retrieve the query type
    /// @return - The query type
    get Query() {
        return this.#queryType;
    }

    /// Retrieve the query handler
    /// @return - The query
    get query() {
        return this.#query;
    }

    /// Retrieve all the records
    /// @return - The list of records
    async all() {
        return await this.query.all();
    }

    /// Retrive the number of records
    /// @param condition - The condition
    /// @return - The count
    async count(condition) {
        return await this.query.count(condition);
    }

    /// Find records
    /// @param condition - The condition
    /// @param search - The search options
    /// @return - The list of records that match the search
    async find(condition, search) {
        return await this.query.find(condition, search);
    }

    /// Find one record
    /// @param condition - The condition
    /// òreturn - The record if exists
    async findOne(condition) {
        return await this.query.findOne(condition);
    }

    /// Find a record by id
    /// @param id - The id
    /// @return - The record if exists
    async findById(id) {
        return await this.query.findById(id);
    }

    /// Find records by ids
    /// @param ids - the set of ids
    /// @return -  The list of records if exist
    async findByIds(ids = Array(), separator = ',') {
        return await this.query.findByIds(ids);
    }

    /// Insert a new record into the database
    /// @param data - The data of the new record
    /// @return - The created record is succeed
    async insert(data) {
        return await this.query.insert(data);
    }

    /// Delete a record by id
    /// @param id - The id
    /// @return - True if succeed
    async deleteById(id) {
        return await this.query.deleteById(id);
    }

    /// Delete records by ids
    /// @param ids - The list of ids
    /// @param separator - The separator character if ids is a string
    /// @return - True if succeed
    async deleteByIds(ids = Array(), separator = ',') {
        return await this.query.deleteByIds(ids);
    }

    /// Update by id
    /// @param id - The id of the record to update
    /// @param data - The fields to update
    /// @return - The true if succeed
    async update(id, data) {
        return await this.query.update(id, data);
    }

    /// Define a new Model type
    /// @param name - The name of the model
    /// @param definition - the definition of the schema
    /// @param configure - The configuration handler
    /// @return - The generated model
    static define(name, definition, configure = (model) => { }) {
        const type = Connection.instance.type;
        if (type == Connection.Type.MongoDB)
        {
            const MongoSchema = require('./mongo/schema');
            return MongoSchema.define(name, definition, configure);
        }
        else 
        {
            assert(false, `Connection of type ${type} not implemented`);
        }
    }
}

module.exports = Schema;