import React, { Fragment } from 'react';
import { Router } from 'overdrive-dashboard';

// components 
import Home from './Home';
import Signin from './Signin';
import Signup from './Signup';
import Footer from './Footer';
// css
import './Footer.css';
import './Web.css';

function NavLink(props) {
    const className = window.location.pathname.includes(props.url) ?
        'nav-item active' : 'nav-item';
    return (
        <li className={className}>
            <a className="nav-link" href={props.url}>{props.name}</a>
        </li>
    );
}

export default function Web(props) {
    return (
        <Fragment>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="/">{props.brand || 'Overdrive'}</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <NavLink url="/signin" name="Sign in" />
                        <NavLink url="/signup" name="Sign up" />
                    </ul>
                </div>
            </nav>
            <Router>
                <Router.Route url="/signin">
                    <Signin />
                </Router.Route>
                <Router.Route url="/signup">
                    <Signup />
                </Router.Route>
                <Router.Route url="/">
                    <Home />
                </Router.Route>
            </Router>
            <Footer />
        </Fragment>
    );
}