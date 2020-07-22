import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
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
        const [page, others] = document.getElementsByClassName('page-wrapper');
        if (page)
        {
            if (page.className.includes('toggled'))
            {
                page.classList.remove('toggled');
            }
            else 
            {
                page.classList.add('toggled');
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