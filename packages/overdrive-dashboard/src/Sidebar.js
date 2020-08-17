import React from 'react';
import Icon from './Icon';
import style from './style.css';

function Brand(props) {
    return (
        <div className={`${style['sidebar-header']} border-bottom bg-light`}>
            <a href="/">{props.name}</a>
        </div>
    );
}

export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <nav className={`${style.sidebar} border-right`}>
                {this.props.brand &&
                    <Brand name={this.props.brand} />}
                <ul className={style.components}>
                    {this.props.children}
                </ul>
            </nav>
        );
    }
}

Sidebar.Section = function (props) {
    return (
        <p>{props.name}</p>
    );
}

Sidebar.Item = function (props) {
    return (
        <li className={props.active ? style.active : ''}>
            <a href={props.url}>
                <Icon icon={props.icon} />
                <span>{props.name}</span>
            </a>
        </li>
    );
}

Sidebar.DropdownItem = function (props) {
    return (
        <li className={props.active ? style.active : ''}>
            <a
                href={'#item' + props.name}
                data-toggle="collapse"
                aria-expanded="false"
                className={style['dropdown-toggle']}
            >
                {props.icon && <Icon icon={props.icon} />}
                {props.name}
            </a>
            <ul className={style.collapse} id={'item' + props.name}>
                {props.children}
            </ul>
        </li>
    );
}