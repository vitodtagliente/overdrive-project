const Controller = require('overdrive').Controller;
const Directory = require('overdrive').IO.Directory;
const Logger = require('overdrive').Logger;
const path = require('path');

/// Setup the server interface
/// @param app - The application
exports.initialize = function (app) {
    Logger.log("Initializing the server interface...");
    // register the controllers
    const controllers = Array();
    for (const file of Directory.getFiles(path.join(__dirname, 'controllers')))
    {
        controllers.push(require(file));
    }
    Controller.load(controllers, app.raw);
}