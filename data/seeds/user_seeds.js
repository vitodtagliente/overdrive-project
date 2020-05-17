const mongoose = require('mongoose');

module.exports = {
    model: require('../models/user_model'),
    data: [
        {
            username: "root",
            email: 'root@root.root',
            password: 'root',
            active: true
        }
    ]
};