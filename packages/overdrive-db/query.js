class Query {
    #context = null;
    /// constructor
    /// @param context - The raw schema/model
    constructor(context) {
        this.#context = context;
    }

    /// Retrieve the context
    /// @return - The context
    get context() {
        return this.#context;
    }

    /// Retrieve all the records
    /// @return - The list of records
    async all() {
        return [];
    }

    /// Retrive the number of records
    /// @param condition - The condition
    /// @return - The count
    async count(condition) {
        return 0;
    }

    async find(condition, search) {
        return [];
    }

    /// Find records
    /// @param condition - The condition
    /// @param search - The search options
    /// @return - The list of records that match the search
    async findOne(condition) {
        return null;
    }

    /// Find a record by id
    /// @param id - The id
    /// @return - The record if exists
    async findById(id) {
        return null;
    }

    /// Find records by ids
    /// @param ids - the set of ids
    /// @return -  The list of records if exist
    async findByIds(ids = Array(), separator = ',') {
        return [];
    }

    /// Insert a new record into the database
    /// @param data - The data of the new record
    /// @return - The created record is succeed
    async insert(data) {
        return null;
    }

    /// Delete a record by id
    /// @param id - The id
    /// @return - True if succeed
    async deleteById(id) {
        return false;
    }

    /// Delete records by ids
    /// @param ids - The list of ids
    /// @param separator - The separator character if ids is a string
    /// @return - True if succeed
    async deleteByIds(ids = Array(), separator = ',') {
        return false;
    }
}

module.exports = Query;