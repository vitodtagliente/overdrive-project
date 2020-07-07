const Schema = require('overdrive-db').Schema;

module.exports = Schema.define('Post', {
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
    content: {
        type: String,
        required: false
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