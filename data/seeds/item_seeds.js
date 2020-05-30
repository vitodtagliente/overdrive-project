const mongoose = require('mongoose');

function generate() {
    let v = Array();

    for(let i = 0; i < 100; ++i)
    {
        v.push({
            name: 'Potion' + i,
            type: "potion"
        });
    }

    return v;
}

module.exports = {
    model: require('../models/item_model'),
    data: generate()
};