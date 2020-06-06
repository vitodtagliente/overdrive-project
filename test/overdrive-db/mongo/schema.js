const Model = require('../model');
const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

class Schema {
    /// Define a new Model type
    /// @param name - The name of the model
    /// @param definition - the definition of the schema
    /// @param configure - The configuration handler
    /// @return - The generated model
    static define(name, definition, configure = (model) => { }) {
        const schema = new mongoose.Schema(definition);
        schema.plugin(timestamp);
        const model = new Model(mongoose.model(name, schema));
        configure(model);
        return model;
    }
};

module.exports = Schema;