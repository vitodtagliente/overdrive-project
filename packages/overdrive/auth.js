const Session = require('./session');
const Status = require('overdrive-status');

class Auth {
    /// Initialize the Auth
    /// @param app - The express application
    static initialize(app) {

    }

    /// authentication middleware
    /// @param req - The http request
    /// @param res - The http response
    /// @param next - The next middleware
    static async isAuthenticated(req, res, next) {
        const session = new Session(req);
        if (session.user != null)
        {
            next();
        }
        else 
        {
            res.respond(Status.Code.Unauthorized);
        }
    }
};

module.exports = Auth;