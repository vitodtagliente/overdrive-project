const Schema = require('overdrive-db').Schema;

module.exports = Schema.define('Item', {
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
    isConsumable: {
        type: Boolean,
        default: false
    },
    isStackable: {
        type: Boolean,
        default: false
    },
    isEquippable: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false,
        trim: true
    }
});