const Controller = require('overdrive').Controller;
const Dashboard = require('./dashboard/dashboard');
const express = require('express');
const Logger = require('overdrive').Logger;
const path = require('path');

/// Add here all the controllers to automatically register at the startup of the application
exports.Controllers = [
    require('./controllers/auth_controller'),
    require('./controllers/home_controller'),
    require('./controllers/test_controller')
];

/// Setup the web interface
/// @param app - The application
exports.initialize = function (app) {
    Logger.log("Initializing the web interface...");
    // setup the view engine
    app.set('view engine', 'ejs');
    // serve a public folder 
    app.use(express.static(path.join(__dirname, '/public')));
    // set the views folder
    app.set('views', path.join(__dirname, '/views'));
    // initialize the dashboard
    Dashboard.initialize(app);
    // register the controllers
    Controller.load(exports.Controllers, app.raw);
}