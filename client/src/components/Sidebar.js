import React from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faPowerOff } from "@fortawesome/free-solid-svg-icons";

function User(props) {
    return (
        <div className="sidebar-item sidebar-header d-flex flex-nowrap">
            <div className="user-pic">

            </div>
            <div className="user-info">
                <span className="user-name">{props.name}</span>
                <span className="user-name">
                    <strong>{props.surname}</strong>
                </span>
                <span className="user-role">{props.role}</span>
                <span className="user-status">
                    <FontAwesomeIcon icon={faCircle} />
                    <span> Online</span>
                </span>
            </div>
        </div>
    );
}

function Brand(props) {
    return (
        <div className="sidebar-item sidebar-brand">
            <a href="/">{props.name}</a>
        </div>
    );
}

function LogoutModal(props) {
    return (
        <div></div>
    );
}

export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    render() {
        return (
            <nav id="sidebar" className="sidebar-wrapper">
                <div className="sidebar-content">
                    <Brand name="Dashboard" />
                    <User name="Vito Domenico" surname="Tagliente" role="Administrator" />
                </div>
                <div className="sidebar-footer">
                    <div>
                        <a data-toggle="modal" data-target="#logout-modal" href="#">
                            <FontAwesomeIcon icon={faPowerOff} />
                        </a>
                    </div>
                </div>
            </nav>
        );
    }
}