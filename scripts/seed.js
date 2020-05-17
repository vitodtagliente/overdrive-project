const config = require('../config');
const Connection = require('mango').Connection;
const Logger = require('overdrive').Logger;
const Seeder = require('mango').Seeder;
const Seeds = require('data').Seeds;

Connection.startup(
    config.CONNECTION,
    async () => {
        await Seeder.seed(Seeds);
        process.exit(0);
    },
    err => Logger.error(`Cannot connect to database:\n ${err}`), 
);