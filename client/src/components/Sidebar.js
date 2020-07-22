import React from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faPowerOff, faTachometerAlt } from "@fortawesome/free-solid-svg-icons";

function User(props) {
    const userImg = `${process.env.PUBLIC_URL}/img/${props.img || 'user.jpg'}`;

    return (
        <div className="sidebar-item sidebar-header d-flex flex-nowrap">
            <div className="user-pic">
                <img className="img-responsive img-rounded mCS_img_loaded" src={userImg} alt="" />
            </div>
            <div className="user-info">
                <span className="user-name">{props.name}</span>
                <span className="user-name">
                    <strong>{props.surname}</strong>
                </span>
                <span className="user-role">{props.role}</span>
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

/*
function LogoutModal(props) {
    return (
        <div></div>
    );
}
*/

function Section(props) {
    return (
        <li className="header-menu">
            <span>{props.name}</span>
        </li>
    );
}

function Item(props) {
    return (
        <li>
            <a href={props.url}>
                <FontAwesomeIcon icon={props.icon} />
                <span className="menu-text">{props.name}</span>
            </a>
        </li>
    );
}

function DropdownItem(props) {
    return (
        <li className="sidebar-dropdown">
            <a href="#">
                <FontAwesomeIcon icon={props.icon} />
                <span className="menu-text">{props.name}</span>
            </a>
            <div className="sidebar-submenu">
                <ul>
                    {props.children}
                </ul>
            </div>
        </li>
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
                    <div className=" sidebar-item sidebar-menu">
                        <ul>
                            <Section name="General" />
                            <Item name="Dashboard" icon={faTachometerAlt} url="/" />
                            <DropdownItem name="Test" icon={faCircle}>
                                <Item name="Dashboard222" icon={faTachometerAlt} url="/" />
                            </DropdownItem>
                        </ul>
                    </div>
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