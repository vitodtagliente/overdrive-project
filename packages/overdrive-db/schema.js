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

    async findOne(condition) {
        return await this.query.findOne(condition);
    }

    async findById(id) {
        return await this.query.findById(id);
    }

    async findByIds(ids = Array(), separator = ',') {
        return await this.query.findByIds(ids);
    }

    async insert(data) {
        return await this.query.insert(data);
    }

    async deleteById(id) {
        return await this.query.deleteById(id);
    }

    async deleteByIds(ids = Array(), separator = ',') {
        return await this.query.deleteByIds(ids);
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