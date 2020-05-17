const mongoose = require('mongoose');

class Connection {
    /// Initialize the connection to mongodb
    /// @param connectionString - The connection string
    /// @param success - The success callback
    /// @param error - the error callback
    static startup(connectionString, success = () => { }, error = (err) => { }) {
        const db = mongoose.connection;

        db.on('error', error);

        db.once('open', success);

        mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    }
}

module.exports = Connection;