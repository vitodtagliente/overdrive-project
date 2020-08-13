import React, { Fragment } from 'react';

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
    const style = `btn btn-sm rounded-0 btn-${(props.variant) ? props.variant : 'primary'}`;
    const active = props.active != null ? props.active : true;
    return (
        <>
            {active &&
                <button
                    type={props.type || 'button'}
                    className={style}
                    onClick={(e) => { if (props['onClick']) props.onClick(e); }}
                >
                    {props.children}
                </button>
            }
        </>
    );
}