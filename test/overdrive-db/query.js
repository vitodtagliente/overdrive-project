class Query {
    #model = null;
    constructor(model) {
        this.#model = model;
    }

    get model() {
        return this.#model;
    }

    async all(search){
        return [];
    }    

    async find(search){
        return null;
    }
}

module.exports = Query;