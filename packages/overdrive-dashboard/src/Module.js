import React from 'react';

export default class Module {
    #id = null
    #url = null;

    constructor(url, id) {
        this.#id = id || url || Math.random().toString(36).substring(2, 15)
            + Math.random().toString(36).substring(2, 15);
        this.#url = url || '/';
    }

    get id() {
        return this.#id;
    }

    get url() {
        return this.#url;
    }

    get pathname() {
        return window.location.pathname;
    }

    get isActive() {
        return this.pathname.includes(this.url);
    }

    sidebar() {
        return null;
    }

    content(context) {
        return null;
    }
}

Module.Content = function (props) {
    return (
        <div>
            {props.name && <h1>{props.name}</h1>}
            {props.description && <p className="lead">{props.description}</p>}
            {props.children}
        </div>
    );
}