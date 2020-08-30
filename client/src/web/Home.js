import React from 'react';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container m-3">
                <h1>Welcome to Overdrive</h1>
                <p className="lead">Use this document as a way to quickly start any new project.<br /> All you get is this text and a mostly barebones HTML document.</p>
            </div>
        );
    }
}