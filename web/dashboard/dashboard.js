const Sidebar = require('./sidebar');

class Dashboard {
    #config = null;
    #sidebar = null;
    static #instance = null;
    /// constructor
    /// @param config - The config file
    constructor(config) {
        this.#config = config;
        this.#sidebar = new Sidebar();
        if(Dashboard.#instance == null)
        {
            Dashboard.#instance = this;
        }
    }

    static get instance(){
        return Dashboard.#instance;
    }

    get sidebar() {
        return this.#sidebar;
    }

    get name() {
        return "Overdrive";
    }
}

module.exports = Dashboard;