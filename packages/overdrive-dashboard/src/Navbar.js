import React from 'react';
import Icon from './Icon';
import style from './style.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    toggleSidebar() {
        const elements = document.getElementsByClassName(style.wrapper);
        if (elements.length > 0)
        {
            const container = elements[0];
            if (container.className.includes(style.toggled))
            {
                container.classList.remove(style.toggled);
            }
            else 
            {
                container.classList.add(style.toggled);
            }
        }
    }

    render() {
        return (
            <nav
                className="navbar navbar-expand navbar-light bg-light border"
            >
                <button
                    id="toggle-sidebar"
                    className="btn"
                    onClick={this.toggleSidebar}
                >
                    <Icon icon={Icon.Images.faBars} />
                </button>
            </nav>
        );
    }
}