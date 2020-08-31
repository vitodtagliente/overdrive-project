const Color = require('./color');
const Stack = require('./stack');
const path = require('path');

/// Retrieve the current date time 
/// @return - The datetime in UTC format
function getCurrentDateTime() {
    return new Date().toUTCString();
}

class Logger {
    /// The color class utility
    static Color = Color;
    /// Log an info
    /// @param data - The data to log
    /// @param category - The category, default Info
    static log(data, category) {
        const datafy = (typeof data === "object") ? JSON.stringify(data) : data;
        console.log(`[${Color.decorate(category || 'Info', Color.Foreground.Cyan)}] [${getCurrentDateTime()}] [${Stack.getFormatedStackTraceElement(1)}]: ${datafy}`);
    }

    /// Log a development info
    /// @param data - The data to log
    /// @param category - The category, default Dev
    static dev(data, category) {
        const datafy = (typeof data === "object") ? JSON.stringify(data) : data;
        console.log(`[${Color.decorate(category || 'Dev', Color.Foreground.Magenta)}] [${getCurrentDateTime()}] [${Stack.getFormatedStackTraceElement(1)}]: ${datafy}`);
    }

    /// Log an error
    /// @param data - The data to log
    static error(data) {
        const datafy = (typeof data === "object") ? JSON.stringify(data) : data;
        console.error(`[${Color.decorate('Error', Color.Foreground.Red)}] [${getCurrentDateTime()}] [${Stack.getFormatedStackTraceElement(1)}]: ${datafy}`);
    }

    /// Log an HTTP request
    /// @param req - The HTTP Request
    /// @param logFileRequests - If true, file requests will be logged too
    static request(req, logFileRequests) {
        const ext = path.extname(req.url);
        if (ext && !logFileRequests)
        {
            return;
        }

        const data = req.method == 'POST' ? req.body : req.params;
        const datafy = JSON.stringify(data);
        console.log(`[${Color.decorate(req.method, Color.Foreground.Green)}] ` +
            `[${getCurrentDateTime()}] ` +
            `[${req.headers['user-agent']}] ` +
            `[${Stack.getFormatedStackTraceElement(1)}] ` +
            `${req.url} ` +
            `${datafy != '{}' ? datafy : ''}`
        );
    }

    /// Express loggin middleware, enable to log all the requests
    /// @param req - The express request
    /// @param res - The express res
    /// @param next - The express next
    static middleware(req, res, next) {
        Logger.request(req);
        next();
    }
}

module.exports = Logger;