import React, { Fragment } from 'react';
import Icon from './Icon';

export default function Button(props) {
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