const User = require('../models/user_model');
const DataProvider = require('mango').DataProvider;

class UserProvider extends DataProvider {
    /// constructor
    constructor() {
        super(User);
    }

    /// Retrieve the user by its email.
    /// @param email - The email of the user.
    /// @return - The user, if it exists
    async getByEmail(email) {
        return await User.findOne({ 'email': email }).exec();
    }

    /// Retrieve the user by its username.
    /// @param username - The username of the user.
    /// @return - The user, if it exists
    async getByUsername(username) {
        return await User.findOne({ 'username': username }).exec();
    }

    /// Check if a user has already taken the username.
    /// @param username - The username to check.
    /// @return - True if the username is available, false otherwise.
    async isUsernameAvailable(username) {
        const foundUsers = await User.findOne({ 'username': username });
        return !foundUsers;
    }

    /// Check if a user has already taken the email.
    /// @param email - The email to check.
    /// @return - True if the email is available, false otherwise.
    async isEmailAvailable(email) {
        const foundUsers = await User.findOne({ 'email': email });
        return !foundUsers;
    }

    /// Add a new user to the db.
    /// @param username - The username of the user.
    /// @param email - The email of the user.
    /// @param hashedPassword - The encrypted password of the user.
    /// @return - True if the user has been correctly created, false otherwise.
    async create(username, email, hashedPassword) {
        if (this.isUsernameAvailable(username) && this.isEmailAvailable(email))
        {
            const data = {
                'username': username,
                'email': email,
                'password': hashedPassword,
                'role': User.Role.Player
            };
            return await super.create(data);
        }
        return null;
    }
};

module.exports = UserProvider;
