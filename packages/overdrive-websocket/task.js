class Task {
    #config = null;
    constructor(config = Object.create(Task.Config)) {

    }

    get config() {
        return this.#config;
    }
};

Task.Config = {
    
};

module.exports = Task;