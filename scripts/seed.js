const config = require('core').Config;
const mango = require('mango');
const Connection = mango.Connection;
const Seeder = mango.Seeder;
const seeds = require('data').Seeds;
const Logger = require('overdrive').Logger;

Connection.startup(
    config.CONNECTION_STRING,
    async () => {
        await Seeder.seed(seeds);
        process.exit(0);
    },
    err => Logger.error(`Cannot connect to database:\n ${err}`), 
);