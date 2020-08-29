import React, { Fragment } from 'react';
import { Button } from 'overdrive-dashboard';
import Auth from '../services/authentication';

export default class Signin extends React.Component {
    constructor(props) {
        super(props);

    }

    handleSignin(e) {
        Auth.signin(
            document.getElementById('inputEmail').value,
            document.getElementById('inputPassword').value
        ).then((res => {
            console.log(res);
        })).catch((err) => {
            console.error(err);
        });
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
                            onClick={(e) => this.handleSignin(e)}
                        />
                    </form>
                </div>
            </Fragment>
        );
    }
}