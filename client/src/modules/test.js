import React from 'react';
import { Module } from 'overdrive-dashboard';

export default class TestModule extends Module {
    constructor() {
        super();
    }

    sidebar() {
        return (
            <div></div>
        );
    }
};