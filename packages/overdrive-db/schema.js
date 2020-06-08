const Connection = require('./connection');

class Schema {
    #name = null;
    #context = null;
    #definition = null;
    #queryType = null;
    #query = null;
    constructor(name, definition, context, queryType) {
        this.#definition = definition;
        this.#name = name;
        this.#context = context;
        this.#queryType = queryType;
        this.#query = new queryType(context);
    }

    get name() {
        return this.#name;
    }

    get context() {
        return this.#context;
    }

    get definition() {
        return this.#definition;
    }

    get Query() {
        return this.#queryType;
    }

    get query() {
        return this.#query;
    }

    /// queries
    async all() {
        return await this.query.all();
    }

    async count(condition) {
        return await this.query.count(condition);
    }

    async find(condition, search) {
        return await this.query.find(condition, search);
    }

    async findOne(condition) {
        return await this.query.findOne(condition);
    }

    async findById(id) {
        return await this.query.get(id);
    }

    async findByIds(ids = Array(), separator = ',') {
        return await this.query.getMany(ids);
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