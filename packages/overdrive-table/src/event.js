export default class Event {
    #listeners = Array();

    constructor() {

    }

    broadcast() {
        for (const listener of this.#listeners)
        {
            listener(...arguments);
        }
    }

    bind(listener) {
        this.#listeners.push(listener);
    }

    unbind(listener) {
        this.#listeners.splice(listener, 1);
    }
};