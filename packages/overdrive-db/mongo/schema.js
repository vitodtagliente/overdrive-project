const mongoose = require('mongoose');
const MongoQuery = require('./query');
const Schema = require('../schema');
const timestamp = require('mongoose-timestamp');

class MongoSchema extends Schema {
    constructor(name, definition, context) {
        super(name, definition, context);
    }
    /// Define a new Model type
    /// @param name - The name of the model
    /// @param definition - the definition of the schema
    /// @param configure - The configuration handler
    /// @return - The generated model
    static define(name, definition, configure = (schema) => { }) {
        const schema = new mongoose.Schema(definition);
        schema.plugin(timestamp);
        // genereate it only one time
        const model = mongoose.models[name] || mongoose.model(name, schema);
        return new Schema(name, definition, model, MongoQuery);
    }
};

module.exports = MongoSchema;