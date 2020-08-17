import React, { Fragment } from 'react';
import Icon from './Icon';

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

ActionBar.Button = function (props) {
    const active = props.active != null ? props.active : true;
    return (
        <>
            {active &&
                <button
                    type={props.type || 'button'}
                    className={'btn btn-sm rounded-0 btn-light border'}
                    style={{
                        padding: "5px 15px"
                    }}
                    onClick={(e) => { if (props['onClick']) props.onClick(e); }}
                >
                    {
                        props.icon &&
                        <>
                            <Icon icon={props.icon} color={props.color} />
                            &nbsp;&nbsp;
                        </>
                    }
                    {props.name}
                    {props.children}
                </button>
            }
        </>
    );
}