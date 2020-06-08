class Connection {
    /// The type enum    
    static Type = {
        Invalid: 'null',
        MongoDB: 'mongodb',
        MySQL: 'mysql'
    }

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

    /// Retrieve the instance
    /// @return - The instance
    static get instance() {
        return global.overdrive_connection;
    }

    /// Initialize the connection to the db
    /// @param type - The type of db
    /// @param connectionString - The connection string
    /// @param options - The options
    /// @param success - The success callback
    /// @param error - the error callback
    static connect(type, connectionString, options, success = () => { }, error = (err) => { }) {
        if (type == this.Type.MongoDB)
        {
            const MongoConnection = require('./mongo/connection');
            const context = MongoConnection.startup(
                connectionString,
                options,
                () => {
                    global.overdrive_connection = new Connection(type, context);
                    success();
                },
                error
            );
        }
        else 
        {
            assert(false, `Connection of type ${type} not implemented`);
        }
    }
}

module.exports = Connection;