const Auth = require('./auth');
const bodyParser = require('body-parser');
const cors = require('cors');
const Connection = require('overdrive-db').Connection;
const cookieParser = require('cookie-parser');
const express = require('express');
const Schema = require('overdrive-json').Schema;
const Logger = require('overdrive-logger');
const Respond = require('./respond');
const Session = require('./session');

class Application {
    /// The express application
    #app = null;
    /// The server configuration
    #config = null;
    /// Express if the server has been initialized
    #initialized = false;
    /// Define if the server has been launched
    #launched = false;
    /// HTTP server
    #server = null;

    /// constructor
    /// @param config - The application configuration
    constructor(config = null) {
        // create the express application
        this.#app = express();

        // cache the configuration
        if (config == null)
        {
            Logger.error('Using a default server configuration...');
        }
        this.#config = Schema(config, Application.Config);
    }

    /// Get the application configuration 
    /// @return - The configuration
    get config() {
        return this.#config;
    }

    /// Get the http layer
    /// @return - The http layer
    get server() {
        return this.#server;
    }

    /// Get the express router
    get router() {
        return this.#app;
    }

    /// Initialize the server
    initialize() {
        if (this.#initialized)
        {
            // server already initialized
            return;
        }

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
        for (const origin of this.#config.crossOrigins)
        {
            this.#app.use(cors({
                origin: origin
            }));
        }

        // initialize the session
        Session.initialize(
            this.#app,
            this.#config.secret,
            this.#config.sessionName,
            this.#config.sessionLifetime
        );
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
            this.initialize();
            return;
        }

        // make sure that the server hasn't been launched
        if (this.#launched)
        {
            return;
        }
        this.#launched = true;

        // start listening 
        this.#server = this.#app.listen(this.#config.port, () => {
            const connectionString = this.#config.connection;
            // check if the server need to connect to the db
            if (connectionString != null)
            {
                // initialize the database connection
                Connection.connect(
                    this.#config.connectionType,
                    connectionString,
                    null,
                    () => {
                        success();
                        Logger.log(`${Logger.Color.decorate('HTTP', Logger.Color.Foreground.Yellow)} Server listening on port ${Logger.Color.decorate(this.#config.port, Logger.Color.Foreground.Magenta)}...`);
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
                Logger.log(`${Logger.Color.decorate('HTTP', Logger.Color.Foreground.Yellow)} Server listening on port ${Logger.Color.decorate(this.#config.port, Logger.Color.Foreground.Magenta)}...`);
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

Application.Config = {
    name: 'overdrive',
    version: 1.0,
    // database
    connection: process.env.connection || 'mongodb://127.0.0.1/overdrive',
    connectionType: process.env.connectionType || 'mongodb',
    env: process.env.env || "development",
    port: process.env.port || 9000,
    secret: process.env.secret || 'OVERDRIVE-SECRET',
    ulr: process.env.URL || "http://localshost:9000",
    // session infos
    sessionName: 'overdrive',
    sessionLifetime: 1000 * 60 * 60 * 2,
    // allowed cross origins
    crossOrigins: [
        // default React cross origin
        "http://localhost:3000"
    ]
};

module.exports = Application;