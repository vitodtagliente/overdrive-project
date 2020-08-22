import React, { Fragment } from 'react';

function pathname() {
    return window.location.pathname;
}

function isActive(url) {
    if (url != null)
    {
        return pathname().includes(url);
    }
    return false;
}

export default function Route(props) {
    return (
        <Fragment>
            {
                isActive(props.url) &&
                props.children
            }
        </Fragment>
    );
}