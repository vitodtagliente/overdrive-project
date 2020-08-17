import React, { Fragment } from 'react';
import Button from './Button';

export default class ActionBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="btn-group mb-3" role="group">
                {this.props.children}
            </div>
        );
    }
}

ActionBar.Button = Button;