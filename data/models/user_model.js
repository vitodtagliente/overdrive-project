const Schema = require('overdrive-db').Schema;

module.exports = Schema.define(
    'User',
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        active: {
            type: Boolean,
            required: false,
            default: true
        },
        role: {
            type: String,
            enum: ['player', 'content-creator', 'admin'],
            required: true,
            default: 'player'
        },
        privileges: {
            type: Array
        }
    }
);