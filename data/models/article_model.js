const Schema = require('overdrive-db').Schema;

module.exports = Schema.define('Article', {
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
    },
    filename: {
        type: String,
        required: true,
        trim: true
    },
    isEnabled: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        trim: true
    },
    tags: {
        type: String
    }
});