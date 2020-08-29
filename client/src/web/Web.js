import React, { Fragment } from 'react';
import { Router } from 'overdrive-dashboard';

// components 
import Home from './Home';
import Signin from './Signin';
import Signup from './Signup';
import Footer from './Footer';

export default class Web extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
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