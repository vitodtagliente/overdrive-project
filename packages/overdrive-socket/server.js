const io = require('socket.io');
const Logger = require('overdrive-logger');

class Server {
    /// socket server
    #socket = null;
    /// http server
    #http = null;

    constructor() {
    }

    get socket() {
        return this.#socket;
    }

    get http() {
        return this.#http;
    }

    listen(http) {
        this.#http = http;
        this.#socket = io(http);
        Logger.log(`${Logger.Color.decorate('WebSocket', Logger.Color.Foreground.Yellow)} Server listening...`);

        this.#socket.on('connect', (socket) => {
            console.log('connection');
        });
    }
}

module.exports = Server;