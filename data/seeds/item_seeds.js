const mongoose = require('mongoose');

module.exports = {
    model: require('../models/item_model'),
    data: [
        {
            name: "Potion",
            type: "potion"
        }
    ]
};