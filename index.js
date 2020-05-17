const Application = require('overdrive').Application;
const config = require('./config');
const server = require('server');
const web = require('web');

const app = new Application();
app.initialize(config);
app.listen(
    () => {
        // initalize the server module
        server.initialize(app);
        if (app.config.raw.WEB_INTERFACE_ENABLED)
        {
            web.initialize(app);
        }
    },
    (error) => {

    }
);