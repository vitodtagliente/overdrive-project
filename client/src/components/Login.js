import React, { Fragment } from 'react';
import { Button } from 'overdrive-dashboard';
import style from './Login.css';
import Footer from './Footer';

export default class Login extends React.Component {
    constructor(props) {
        super(props);

    }

    handleLogin(e) {

    }

    render() {
        return (
            <Fragment>
                <div className="login">
                    <form>
                        <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                        <div className="form-group">
                            <input type="email" id="inputEmail" className="form-control rounded-0" placeholder="Email address" required autoFocus />
                        </div>
                        <div className="form-group">
                            <input type="password" id="inputPassword" className="form-control rounded-0" placeholder="Password" required />
                        </div>
                        <div className="checkbox mb-3">
                            <label>
                                <input type="checkbox" value="remember-me" /> Remember me
                    </label>
                        </div>
                        <Button
                            name="Sign in"
                            type="submit"
                            onClick={(e) => this.handleLogin(e)}
                        />
                    </form>
                </div>
                <Footer />
            </Fragment>
        );
    }
}