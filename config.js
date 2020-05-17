module.exports = {
    CONNECTION: process.env.CONNECTION || 'mongodb://127.0.0.1/mrpg',
    ENV: process.env.ENV || "development",
    PORT: process.env.PORT || 3000,
    SECRET: process.env.SECRET || 'OVERDRIVE-SECRET',
    URL: process.env.URL || "http://localshost:3000",
    WEB_INTERFACE_ENABLED: true
};