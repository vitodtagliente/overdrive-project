import React from 'react';
import style from './Footer.css';

export default class Footer extends React.Component {
    constructor(props) {
        super(props);

    }

    handleLogin(e) {

    }

    render() {
        return (
            <div className="footer">
                <span>Power by <a href="/dddd">overdrive</a></span>
            </div>
        );
    }
}