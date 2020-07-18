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
            res.dashboard = (view, ...args) => {
                let data = {
                    dashboard: this.instance,
                    view: `../${view}`
                };
                for (const arg of [...args])
                {
                    for (const field of Object.keys(arg))
                    {
                        data[field] = arg[field];
                    }
                }
                res.render('dashboard/dashboard', data);
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