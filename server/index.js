const Application = require('overdrive').Application;
const config = require('./config');
const Controller = require('overdrive').Controller;
const Directory = require('overdrive').IO.Directory;
const Logger = require('overdrive').Logger;
const path = require('path');
const Server = require('overdrive-websocket').Server;

const app = new Application(config);
app.initialize();
app.listen(
    () => {
        // initalize the server module
        Logger.log("Starting Overdrive Server...");
        // register the controllers
        const controllers = Array();
        for (const file of Directory.getFiles(path.join(__dirname, 'controllers')))
        {
            controllers.push(require(file));
        }
        Controller.load(controllers, app.raw);

        // run the socket server instance
        Logger.log("Initializing the WebSocket interface...");
        const server = new Server();
        server.listen(app.server);
    },
    (error) => {

    }
);