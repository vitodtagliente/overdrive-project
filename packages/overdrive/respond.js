/// Middleware that add the 'respond' method to the express res
module.exports = (req, res, next) => {
    /// Reply with a jeson response
    /// @param status - The status code
    /// @param data - The json data to send
    res.respond = (status, data = null) => {
        res.status(status).json(data);
    };
    next();
};