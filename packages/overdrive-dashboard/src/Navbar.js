import React from 'react';
import Icon from './Icon';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    toggleSidebar() {
        const elements = document.getElementsByClassName('page-wrapper');
        if (elements.length > 0)
        {
            const container = elements[0];
            if (container.className.includes('toggled'))
            {
                container.classList.remove('toggled');
            }
            else 
            {
                container.classList.add('toggled');
            }
        }
    }

    render() {
        return (
            <nav className="navbar navbar-expand navbar-light bg-light">
                <button id="toggle-sidebar" className="btn" onClick={this.toggleSidebar}>
                    <Icon icon={Icon.Images.faBars} />
                </button>
            </nav>
        );
    }
}