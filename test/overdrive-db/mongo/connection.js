const mongoose = require('mongoose');

class Connection {
    /// Initialize the connection to mongodb
    /// @param connectionString - The connection string
    /// @param options - The options
    /// @param success - The success callback
    /// @param error - the error callback
    /// @return - The connection object
    static startup(connectionString, options = null, success = () => { }, error = (err) => { }) {
        const db = mongoose.connection;

        db.on('error', error);

        db.once('open', success);

        mongoose.connect(
            connectionString,
            options ||
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            }
        );

        return db;
    }
}

module.exports = Connection;