class Query {
    #context = null;
    constructor(context) {
        this.#context = context;
    }

    get context() {
        return this.#context;
    }

    get Search() {
        return Search;
    }

    get search() {
        return new Search();
    }

    async all() {
        return [];
    }

    async count(condition) {
        return 0;
    }

    async find(condition, search) {
        return [];
    }

    async findOne(condition) {
        return null;
    }

    async findById(id) {
        return null;
    }

    async findByIds(ids = Array(), separator = ',') {
        return [];
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