class Query {
    #context = null;
    constructor(context) {
        this.#context = context;
    }

    get context() {
        return this.#context;
    }

    async all(search) {
        return [];
    }

    async find(search) {
        return [];
    }

    async findOne(search) {
        return null;
    }

    async findById(id) {
        return null;
    }

    async findByIds(ids = Array(), separator = ',') {
        return [];
    }

    async count() {
        return 0;
    }

    async find(search) {
        return null;
    }

    async insert(data) {
        return null;
    }

    async deleteById(id) {
        return false;
    }

    async deleteByIds(ids = Array(), separator = ',') {
        return false;
    }
}

module.exports = Query;