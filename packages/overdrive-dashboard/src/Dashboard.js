import React from 'react';
import './Dashboard.css';

import Navbar from './Navbar';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="page-wrapper default-theme toggled">

                <main className="page-content">
                    <Navbar />
                </main>
            </div >
        );
    }
}
