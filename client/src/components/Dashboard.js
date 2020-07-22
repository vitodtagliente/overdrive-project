import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Dashboard.css';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    render() {
        return (
            <div className="page-wrapper default-theme toggled">
                <Sidebar brand="Dashboard" />
                <main className="page-content">
                    <Navbar />
                </main>
            </div>
        );
    }
}