const Controller = require('overdrive').Controller;
const Logger = require('overdrive').Logger;

/// Add here all the controllers to automatically register at the startup of the application
exports.Controllers = [
    require('./controllers/auth_controller'),
    require('./controllers/item_controller')
];

/// Setup the server interface
/// @param app - The application
exports.initialize = function (app) {
    Logger.log("Initializing the server interface...");
    // register the controllers
    Controller.load(exports.Controllers, app.raw);
}