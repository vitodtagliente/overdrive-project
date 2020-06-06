class Model {

    #type = null;
    #raw = null;
    #query = null;
    #schema = {};
    constructor(type, schema, raw, query) {
        this.#raw = raw;
        this.#query = query;
        this.#schema = schema;
        this.#type = type;
    }

    get raw() {
        return this.#raw;
    }

    get Query() {
        return this.#query;
    }

    get Schema() {
        return this.#schema;
    }

    get type() {
        return this.#type;
    }

    async all(search = {}) {
        this.Query.all(search);
    }

    async find(search = {}) {
        this.Query.find(search);
    }

    /// Check if the given model is valid
    /// @param model - The input model
    /// @return - True if it is a real model
    static isValid(model) {
        return typeof model == typeof this.Type;
    }

}

module.exports = Model;