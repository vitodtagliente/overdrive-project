import React from 'react';
import './Dashboard.css';

import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="page-wrapper default-theme toggled">
                <Sidebar
                    brand="Dashboard"
                >
                    
                </Sidebar>
                <main className="page-content">
                    <Navbar />
                    <div className="container-fluid mt-3">

                    </div>
                </main>
            </div>
        );
    }
}
