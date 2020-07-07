const Schema = require('overdrive-db').Schema;

module.exports = Schema.define('Theme', {
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    }
});