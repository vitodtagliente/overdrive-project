import React from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function User(props) {
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

export function Brand(props) {
    return (
        <div className="sidebar-item sidebar-brand">
            <a href="/">{props.name}</a>
        </div>
    );
}

export function Section(props) {
    return (
        <li className="header-menu">
            <span>{props.name}</span>
        </li>
    );
}

export function Item(props) {
    return (
        <li>
            <a href={props.url}>
                <FontAwesomeIcon icon={props.icon} />
                <span className="menu-text">{props.name}</span>
            </a>
        </li>
    );
}

export function DropdownItem(props) {
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

export function Content(props) {
    return (
        <div className="sidebar-content">
            {props.children}
        </div>
    );
}

export function Footer(props) {
    return (
        <div className="sidebar-footer">
            <div>
                {props.children}
            </div>
        </div>
    );
}

export function Menu(props) {
    return (
        <div className=" sidebar-item sidebar-menu">
            <ul>
                {props.children}
            </ul>
        </div>
    );
}

export function Sidebar(props) {
    return (
        <nav id="sidebar" className="sidebar-wrapper">
            {props.children}
        </nav>
    );
}