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

export default function Router(props) {

    let activeChild = null;

    for (const child of props.children)
    {
        if (isActive(child.props.url))
        {
            activeChild = child;
            break;
        }
    }

    return (
        <Fragment>
            {activeChild}
        </Fragment>
    );
}

Router.Route = function (props) {
    return (
        <Fragment>
            {props.children}
        </Fragment>
    );
}