class Connection {
    #context = null;
    #type = null;
    constructor(type, context) {
        this.#context = context;
        this.#type = type;
    }

    get context() {
        return this.#context;
    }

    get type() {
        return this.#type;
    }
}

class Singleton {
    /// the instance
    #instance = null;
    /// constructor
    constructor() {
        this.#instance = new Connection();
    }

    /// The type enum    
    Type = {
        Invalid: 'null',
        MongoDB: 'mongodb',
        MySQL: 'mysql'
    }

    /// Retrieve the instance
    /// @return - The instance
    get instance() {
        return this.#instance;
    }

    /// Initialize the connection to the db
    /// @param type - The type of db
    /// @param connectionString - The connection string
    /// @param options - The options
    /// @param success - The success callback
    /// @param error - the error callback
    connect(type, connectionString, options, success = () => { }, error = (err) => { }) {
        if (type == this.Type.MongoDB)
        {
            const MongoConnection = require('./mongo/connection');
            const context = MongoConnection.startup(
                connectionString,
                options,
                success,
                error
            );
            this.#instance = new Connection(type, context);
        }
        else 
        {
            assert(false, `Connection of type ${type} not implemented`);
        }
    }
}

module.exports = new Singleton();