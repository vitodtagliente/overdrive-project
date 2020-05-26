const Controller = require('overdrive').Controller;
const Dashboard = require('./dashboard/dashboard');
const Directory = require('overdrive').IO.Directory;
const express = require('express');
const Logger = require('overdrive').Logger;
const path = require('path');

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
    const controllers = Array();
    for (const file of Directory.getFiles(path.join(__dirname, 'controllers')))
    {
        controllers.push(require(file));
    }
    Controller.load(controllers, app.raw);
}