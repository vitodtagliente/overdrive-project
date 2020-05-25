const session = require('express-session');

class Session {
    /// The request
    #req = null;

    /// constructor
    /// @param req - the http request
    constructor(req) {
        this.#req = req;
    }

    /// Retrieve the data
    /// @return - The session data
    get data() {
        return this.#req.session;
    }

    /// Set the data
    /// @param value - the new data
    set data(value) {
        if (this.#req != null && this.#req.session != null)
        {
            this.#req = value;
        }
    }

    /// Destroy the session
    destroy() {
        if (this.data)
        {
            this.data.destroy((err) => {
                
            });
        }
        return true;
    }

    /// Initialize the session module
    /// @param app - The express application
    /// @param secret - The secret
    static initialize(app, secret) {
        app.use(session({
            secret,
            resave: false,
            saveUninitialized: false,
            /// activate if on https
            cookie: { secure: false }
        }));
    }

    /// Retrieve the user info
    /// @return - The user, if exists
    get user() {
        if (this.data != null)
        {
            return this.data.user;
        }
        return null;
    }

    /// set the user
    /// @param user - The user
    set user(value) {
        if (this.data != null)
        {
            this.data.user = value;
        }
    }
};

module.exports = Session;