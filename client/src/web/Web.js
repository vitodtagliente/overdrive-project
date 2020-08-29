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

export default class Web extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="/">Navbar</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item">
                                <a class="nav-link" href="/signin">Sign in</a>
                            </li>
                            <li className="nav-item">
                                <a class="nav-link" href="/signup">Sign up</a>
                            </li>
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
}