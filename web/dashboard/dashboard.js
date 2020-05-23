const Sidebar = require('./sidebar');

class Dashboard {
    #sidebar = null;
    /// constructor
    constructor() {
        this.#sidebar = new Sidebar();
    }

    get sidebar() {
        return this.#sidebar;
    }

    get name() {
        return "ciao";
    }
}

module.exports = Dashboard;