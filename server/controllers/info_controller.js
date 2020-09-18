const Controller = require('overdrive').Controller;
const Status = require('overdrive').Status;

class InfoController extends Controller {
    /// Retrieve the status of the server
    static status(req, res) {
        return res.respond(Status.Code.OK, {
            
        });
    }

    /// Register the controller routes
    /// @param router - The router
    register(router) {
        router.get('/', InfoController.status);
        router.get('/status', InfoController.status);
    }
}

module.exports = InfoController;