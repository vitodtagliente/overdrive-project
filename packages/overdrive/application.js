const Auth = require('./auth');
const bodyParser = require('body-parser');
const cors = require('cors');
const Connection = require('overdrive-db').Connection;
const cookieParser = require('cookie-parser');
const express = require('express');
const Logger = require('overdrive-logger');
const Respond = require('./respond');
const Session = require('./session');

class ApplicationConfig {
    #config = null;
    /// constructor
    /// @param config - The config json
    constructor(config = null) {
        if (config == null)
        {
            Logger.error('Using a default server configuration...');
        }
        this.#config = config;
    }

    get connection() {
        return this.#config.CONNECTION;
    }

    get env() {
        return this.#config.ENV || "development";
    }

    get port() {
        return this.#config.PORT || 3000;
    }

    get raw() {
        return this.#config;
    }

    get secret() {
        return this.#config.SECRET || 'OVERDRIVE-SECRET';
    }

    get type() {
        return this.#config.CONNECTION_TYPE || Connection.Type.MongoDB;
    }

    get url() {
        return this.#config.URL || `http://localshost:${this.port}`;
    }
}

class Application {
    /// The express application
    #app = null;
    /// The server configuration
    #config = null;
    /// Express if the server has been initialized
    #initialized = false;
    /// Define if the server has been launched
    #launched = false;

    /// constructor
    constructor() {
        // create the express application
        this.#app = express();

        // parse application/x-www-form-urlencoded
        this.#app.use(bodyParser.urlencoded({ extended: false }));
        // parse application/json
        this.#app.use(bodyParser.json());
        // parse cookies
        this.#app.use(cookieParser());
        // log every request
        this.#app.use(Logger.middleware);
        // add the respond method
        this.#app.use(Respond);
        // allow cross origin requests
        this.#app.use(cors());
    }

    /// Get the application configuration 
    /// @return - The configuration
    get config() {
        return this.#config;
    }

    /// Initialize the server
    /// @param config - The configuration json
    initialize(config = null) {
        if (this.#initialized)
        {
            // server already initialized
            return;
        }
        
        // parse the configuration
        this.#config = new ApplicationConfig(config);

        // initialize the session
        Session.initialize(this.#app, this.#config.secret);
        // initialize the authentication
        Auth.initialize(this.#app);

        this.#initialized = true;
    }

    /// Move the server in listen state
    /// @param success - The success callback
    /// @param error - the error callback
    listen(success = () => { }, error = (err) => { }) {
        // make sure that the server is initialized
        if (this.#initialized == false)
        {
            Logger.error('Cannot start the server since it is not initialized');
            return;
        }

        // make sure that the server hasn't been launched
        if (this.#launched)
        {
            return;
        }
        this.#launched = true;

        // start listening 
        this.#app.listen(this.#config.port, () => {
            const connectionString = this.#config.connection;
            // check if the server need to connect to the db
            if (connectionString != null)
            {
                // initialize the database connection
                Connection.connect(
                    this.#config.type,
                    connectionString,
                    null,
                    () => {
                        success();
                        Logger.log(`Server listening on port ${this.#config.port}...`);
                    },
                    (err) => {
                        Logger.error(`Cannot connect to database:\n ${err}`);
                        error(err);
                    }
                );
            }
            else 
            {
                success();
                Logger.log(`Server listening on port ${this.#config.port}...`);
            }
        });
    }

    /// Retrieve the express context
    get raw() {
        return this.#app;
    }

    /// Set a variable in the application
    /// @param name - The name of the variable
    /// @param value - The value of the variable
    set(name, value) {
        this.#app.set(name, value);
    }

    /// Add a middleware to the application
    /// @param middleware - The middleware
    use(middleware) {
        this.#app.use(middleware);
    }
}

module.exports = Application;