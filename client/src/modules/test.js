import React from 'react';
import { Module, Sidebar } from 'overdrive-dashboard';

export default class TestModule extends Module {
    constructor(url, id) {
        super(url, id);
    }

    sidebar() {
        return (
            <>
                <Sidebar.Item url={this.url} name="test" />
                <Sidebar.Item url={this.url + '/1'} name="test1" />
            </>
        );
    }

    content(context) {
        return (
            <div>Test Content</div>
        );
    }
};