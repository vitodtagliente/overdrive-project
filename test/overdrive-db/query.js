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
        return null;
    }

    async insert(data) {
        return null;
    }
}

module.exports = Query;