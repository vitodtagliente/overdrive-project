import React from 'react';

export default class Module {
    #id = null

    constructor(id) {
        this.#id = id || Math.random().toString(36).substring(2, 15)
            + Math.random().toString(36).substring(2, 15);
    }

    get id() {
        return this.#id;
    }

    sidebar() {
        return null;
    }

    content(context) {
        return null;
    }
}