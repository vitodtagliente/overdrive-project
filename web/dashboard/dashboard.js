const Sidebar = require('./sidebar');

class Dashboard {
    #config = null;
    #sidebar = null;
    /// constructor
    /// @param config - The config file
    constructor() {
        this.#sidebar = new Sidebar();
    }

    get sidebar() {
        return this.#sidebar;
    }

    get name() {
        return "Overdrive";
    }
}

class Singleton {
    #instance = null;
    /// constructor
    constructor() {
        this.#instance = new Dashboard;
    }

    /// Initialize the module
    /// @param app - The application
    initialize(app) {
        app.use((req, res, next) => {
            /// Generate a new dashboard
            /// @param view - The view to render in the dashboard
            res.dashboard = (view) => {
                res.render('dashboard/dashboard', {
                    dashboard: this.instance,
                    view: `../${view}`
                });
            };
            next();
        });
    }

    /// Retrieve the instance
    /// @return - The instance
    get instance() {
        return this.#instance;
    }
}

module.exports = new Singleton();