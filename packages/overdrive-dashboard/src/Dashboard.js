import React, { Fragment } from 'react';
import style from './style.css';

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
            <>
                <div className={style.wrapper}>
                    <Sidebar
                        brand={this.props.brand || 'Dashboard'}
                    >
                        {this.props.modules.map((module, index) =>
                            <Fragment key={index}>
                                {module.sidebar()}
                            </Fragment>
                        )}
                    </Sidebar>
                    <div className={style.content}>
                        <Navbar />
                        <div className="container-fluid mt-3 mb-3">
                            {this.module && this.module.content()}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
