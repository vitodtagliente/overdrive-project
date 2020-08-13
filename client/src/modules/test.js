import React from 'react';
import { Module, Sidebar } from 'overdrive-dashboard';

export default class TestModule extends Module {
    constructor(url, id) {
        super(url, id);
    }

    sidebar() {
        return (
            <>
                <Sidebar.Item url={this.url} name="foo" />
                <Sidebar.Item url={this.url + '/1'} name="foo1" />
            </>
        );
    }

    content(context) {
        return (
            <div>Test Content</div>
        );
    }
};