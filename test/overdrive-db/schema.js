const Connection = require('./connection');

class Schema {
    /// Define a new Model type
    /// @param name - The name of the model
    /// @param definition - the definition of the schema
    /// @param configure - The configuration handler
    /// @return - The generated model
    static define(name, definition, configure = (model) => { }) {
        const type = Connection.instance.type;
        if (type == Connection.Type.MongoDB)
        {
            const MongoSchema = require('./mongo/schema');
            return MongoSchema.define(name, definition, configure);
        }
        else 
        {
            assert(false, `Connection of type ${type} not implemented`);
        }
    }
}

module.exports = Schema;