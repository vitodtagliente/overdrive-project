import React from 'react';
import Icon from './Icon';
import './Sidebar.css';

function User(props) {
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
                <Icon icon={props.icon} />
                <span className="menu-text">{props.name}</span>
            </a>
        </li>
    );
}

function DropdownItem(props) {
    return (
        <li className="sidebar-dropdown">
            <a href="#">
                <Icon icon={props.icon} />
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

function Content(props) {
    return (
        <div className="sidebar-content">
            {props.children}
        </div>
    );
}

function Footer(props) {
    return (
        <div className="sidebar-footer">
            <div>
                {props.children}
            </div>
        </div>
    );
}

function Menu(props) {
    return (
        <div className=" sidebar-item sidebar-menu">
            <ul>
                {props.children}
            </ul>
        </div>
    );
}

export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <nav id="sidebar" className="sidebar-wrapper">
                <Content>
                    {this.props.brand &&
                        <Brand name={this.props.brand} />}
                    <Menu>
                        {this.props.children}
                    </Menu>
                </Content>
                <Footer>
                    <a data-toggle="modal" data-target="#logout-modal" href="#">
                        <Icon icon="" />
                    </a>
                </Footer>
            </nav>
        );
    }
}