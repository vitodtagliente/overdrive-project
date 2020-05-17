const Stack = require('./stack');
const path = require('path');

/// Retrieve the current date time 
/// @return - The datetime in UTC format
function getCurrentDateTime() {
    return new Date().toUTCString();
}

class Logger {
    /// Log an info
    /// @param data - The data to log
    /// @param category - The category, default Info
    static log(data, category) {
        const datafy = (typeof data === "object") ? JSON.stringify(data) : data;
        console.log(`[${category || 'Info'}] [${getCurrentDateTime()}] [${Stack.getFormatedStackTraceElement(1)}]: ${datafy}`);
    }

    /// Log a development info
    /// @param data - The data to log
    /// @param category - The category, default Dev
    static dev(data, category) {
        const datafy = (typeof data === "object") ? JSON.stringify(data) : data;
        console.log(`[${category || 'Dev'}] [${getCurrentDateTime()}] [${Stack.getFormatedStackTraceElement(1)}]: ${datafy}`);
    }

    /// Log an error
    /// @param data - The data to log
    static error(data) {
        const datafy = (typeof data === "object") ? JSON.stringify(data) : data;
        console.error(`[Error] [${getCurrentDateTime()}] [${Stack.getFormatedStackTraceElement(1)}]: ${datafy}`);
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
        console.log(`[${req.method}] ` +
            `[${getCurrentDateTime()}] ` +
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