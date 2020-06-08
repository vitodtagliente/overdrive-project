class Search {
    #condition = {};
    #limit = null;
    #offset = 0;
    #sort = {};
    constructor(condition = {}) {
        this.#condition = condition;
    }

    get condition() {
        return this.#condition;
    }

    get limit() {
        return this.#limit;
    }

    get offset() {
        return this.#offset;
    }

    get sort() {
        return this.#sort;
    }

    hasPagination() {
        return this.limit != null && this.limit > 0;
    }

    paginate(limit, offset = 0) {
        this.#limit = limit;
        this.#offset = offset;
        return this;
    }

    sort() {


        return this;
    }
}

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

    async count(search) {
        return 0;
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