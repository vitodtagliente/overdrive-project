import React from 'react';

export default function Alert(props) {
    return (
        <div className={`alert alert-${props.variant ? props.variant : 'info'} alert-dismissible rounded-0 fade show`} role="alert">
            {props.children}
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    );
}