const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

class Model {
    /// Model id type
    static Id = {
        /// the type of the id
        Type: mongoose.Schema.Types.ObjectId,
        /// Check if a given id is a valid one
        /// @param id - The input id
        /// @return - True if is it valid
        isValid: (id) => {
            return mongoose.Types.ObjectId.isValid(id);
        }
    };
    /// The base type of a model
    static Type = mongoose.Model;
    /// Define a new model
    /// @param name - The name of the model
    /// @param description - the fields of the model
    /// @param configure - The configuration handler
    /// @return - The mongoose model
    static define(name, description, configure = (schema) => { }) {
        const schema = new mongoose.Schema(description);
        configure(schema);
        schema.plugin(timestamp);
        return mongoose.model(name, schema)
    }
    /// Check if the given model is valid
    /// @param model - The input model
    /// @return - True if it is a real model
    static isValid(model) {
        return typeof model == typeof this.Type;
    }
};

module.exports = Model;