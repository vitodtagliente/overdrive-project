const Schema = require('overdrive-db').Schema;

module.exports = Schema.define('Page', {
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
    category: {
        type: String,
        trim: true
    },
    tags: {
        type: String
    },
    isEnabled: {
        type: Boolean,
        default: true
    },
    isHome: {
        type: Boolean,
        default: false
    }
});