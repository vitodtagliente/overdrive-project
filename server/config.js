module.exports = {
    CONNECTION: process.env.CONNECTION || 'mongodb://127.0.0.1/mrpg',
    CONNECTION_TYPE: process.env.CONNECTION_TYPE || 'mongodb',
    ENV: process.env.ENV || "development",
    PORT: process.env.PORT || 3000,
    SECRET: process.env.SECRET || 'OVERDRIVE-SECRET',
    URL: process.env.URL || "http://localshost:3000"
};