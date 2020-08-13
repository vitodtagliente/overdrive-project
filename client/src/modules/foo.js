import React from 'react';
import { Module, Sidebar } from 'overdrive-dashboard';

export default class FooModule extends Module {
    constructor(url, id) {
        super(url, id);
    }

    sidebar() {
        return (
            <>
                <Sidebar.Item url={this.url} name="foo" />
            </>
        );
    }

    content(context) {
        return (
            <div>Foo Content</div>
        );
    }
};