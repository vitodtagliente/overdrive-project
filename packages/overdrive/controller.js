const express = require('express');
const Logger = require('overdrive-logger');
const Type = require('./type');

class Controller {
    /// Register the routers for a list of controllers
    /// @param controllers - The list of controller classes
    /// @param app - The overdrive application
    static load(controllers = Array(), app = null) {
        const router = app ? app.router : express.Router();
        for (const controller of controllers)
        {
            if (Type.isSubclassOf(controller, Controller))
            {
                try
                {
                    Logger.log(`Registering ${controller.name}...`);
                    const instance = new controller();
                    instance.register(router);
                }
                catch (err)
                {
                    Logger.error(`Cannot register ${controller.name}\n${err}`);
                }
            }
            else 
            {
                Logger.error(`Invalid controller type for '${controller.name}'`);
            }
        }
        return router;
    }

    /// Register the controller routes
    /// @param router - The express router
    register(router) {
        // implement this in derived controllers
    }
};

module.exports = Controller;