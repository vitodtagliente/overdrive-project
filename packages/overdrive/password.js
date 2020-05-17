const bcrypt = require('bcrypt');

class Password {
    /// salt rounds
    static saltRounds = 10;
    /// Encrypt the password.
    /// @param password - The password to encrypt.
    /// @returns - A promise with two argument: the error string and hashed password.
    static async hash(password) {
        return await bcrypt.hash(password, this.saltRounds);
    }

    /// Check if the plain text password is equal to the hashed one.
    /// @param password - The password not encrypted.
    /// @param saltRounds - The already encrypted password.
    /// @returns - A promise with two argument: the error string and boolean results.
    static async compare(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = Password;