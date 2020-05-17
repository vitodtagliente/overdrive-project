const Auth = require('overdrive').Auth;
const Controller = require('overdrive').Controller;
const Password = require('overdrive').Password;
const Session = require('overdrive').Session;
const Status = require('overdrive').Status;
const UserProvider = require('data').Providers.UserProvider;
const Validation = require('overdrive').Validation;

class AuthController extends Controller {
    /// Retrieve the session info
    static async session(req, res) {
        const session = new Session(req);
        res.respond(
            session.user ? Status.Code.OK : Status.Code.Unauthorized,
            session.user
        );
    }

    /// Handle the login request
    static async login(req, res) {
        const { email, password } = req.body;
        // validate the data
        if (!Validation.empty([email, password]))
        {
            const result = await UserProvider.findOne({ email });
            const user = result.data;
            if (result.status == Status.Code.OK && user != null)
            {
                if (await Password.compare(password, user.password))
                {
                    // store the user id into the session
                    const session = new Session(req);
                    session.data.user = { id: user.id };
                    res.respond(Status.Code.OK);
                    return;
                }
            }
        }
        res.respond(Status.Code.Unauthorized);
    }

    /// Handle the register request
    static async register(req, res) {
        const { username, email, password } = req.body;
        // validate the data
        if (!Validation.empty([username, email, password]) 
            && Validation.email(email))
        {
            const hashedPassword = await Password.hash(password);
            const result = await UserProvider.create({
                username,
                email,
                password: hashedPassword
            });
            res.respond(result.status);
        }
        else 
        {
            res.respond(Status.Code.BadRequest);
        }
    }

    /// Handle the logout request
    static async logout(req, res) {
        const session = new Session(req);
        res.respond(session.destroy() ? Status.Code.OK : Status.Code.InternalServerError);
    }

    /// Register the controller routes
    /// @param router - The router
    register(router) {
        router.get('/api/auth', AuthController.session);
        router.post('/api/auth/login', AuthController.login);
        router.post('/api/auth/register', AuthController.register);
        router.get('/api/auth/logout', AuthController.logout);
    }
}

module.exports = AuthController;