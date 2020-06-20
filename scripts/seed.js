const config = require('../config');
const Connection = require('overdrive-db').Connection;
const Logger = require('overdrive').Logger;
const Seeder = require('overdrive-db').Seeder;

// initialize the database connection
Connection.connect(
    config.CONNECTION_TYPE,
    config.CONNECTION,
    null,
    async () => {
        const seeds = require('data').Seeds;
        await Seeder.seed(seeds);
        process.exit(0);
    },
    (err) => {
        Logger.error(`Cannot connect to database:\n ${err}`);
        error(err);
    }
);