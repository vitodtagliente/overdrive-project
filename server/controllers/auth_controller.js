const Auth = require('overdrive').Auth;
const Controller = require('overdrive').Controller;
const Password = require('overdrive').Password;
const Session = require('overdrive').Session;
const Status = require('overdrive').Status;
const User = require('data').Models.User;
const Validation = require('overdrive').Validation;

class AuthController extends Controller {
    /// Handle the login request
    static async signin(req, res) {
        const { email, password } = req.body;
        // validate the data
        if (!Validation.empty([email, password]))
        {
            const session = new Session(req);
            if (session.user != null)
            {
                // already logged in
                const result = await User.findById(session.user.id);
                if (result.status == Status.Code.OK)
                {
                    if (result.data.email == email)
                    {
                        return res.respond(Status.Code.OK);
                    }
                }
                return res.respond(Status.Code.BadRequest);
            }

            const user = await User.findOne({ email });
            if (user != null)
            {
                if (await Password.compare(password, user.password))
                {
                    // store the user id into the session
                    session.data.user = { id: user.id };
                    return res.respond(Status.Code.OK);
                }
            }
        }
        res.respond(Status.Code.Unauthorized);
    }

    /// Handle the register request
    static async signup(req, res) {
        const { username, email, password } = req.body;
        // validate the data
        if (!Validation.empty([username, email, password])
            && Validation.email(email))
        {
            const hashedPassword = await Password.hash(password);
            const result = await User.insert({
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
        router.post('/api/auth/signin', AuthController.signin);
        router.post('/api/auth/signup', AuthController.signup);
        router.get('/api/auth/logout', AuthController.logout);
    }
}

module.exports = AuthController;