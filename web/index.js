const Controller = require('overdrive').Controller;
const express = require('express');
const Logger = require('overdrive').Logger;
const path = require('path');

/// Add here all the controllers to automatically register at the startup of the application
exports.Controllers = [
    require('./controllers/home_controller')
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
    // register the controllers
    Controller.load(exports.Controllers);
}