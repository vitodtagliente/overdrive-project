import React from 'react';
import './Dashboard.css';

import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            module: this.dispatch()
        };
    }

    get module() {
        if (this.state.module < this.props.modules.length)
        {
            return this.props.modules[this.state.module];
        }
        return null;
    }

    get url() {
        return window.location.pathname;
    }

    dispatch() {
        for (var i = 0; i < this.props.modules.length; ++i)
        {
            var module = this.props.modules[i];
            if (module.isActive)
            {
                return i;
            }
        }
        return this.props.defaultModule || 0;
    }

    render() {
        return (
            <div className="page-wrapper default-theme toggled">
                <Sidebar
                    brand="Dashboard"
                >
                    {this.props.modules.map((module) =>
                        module.sidebar()
                    )}
                </Sidebar>
                <main className="page-content">
                    <Navbar />
                    <div className="container-fluid mt-3">
                        {this.module && this.module.content()}
                    </div>
                </main>
            </div>
        );
    }
}
