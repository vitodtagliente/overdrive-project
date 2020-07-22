import React from 'react';
import { Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }

    componentDidUpdate() {

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
            <Navbar bg="light">
                <button id="toggle-sidebar" className="btn" onClick={this.toggleSidebar}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </Navbar>
        );
    }
}