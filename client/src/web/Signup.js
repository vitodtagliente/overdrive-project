import React, { Fragment } from 'react';
import { Button } from 'overdrive-dashboard';
import Auth from '../services/authentication';

export default class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSignup(e) {
        Auth.signup(
            document.getElementById('inputUsername').value,
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
                <div className="content">
                    <form>
                        <h1 className="h3 mb-3 font-weight-normal">Sign up</h1>
                        <div className="form-group">
                            <input type="text" id="inputUsername" className="form-control rounded-0" placeholder="Username" required autoFocus />
                        </div>
                        <div className="form-group">
                            <input type="email" id="inputEmail" className="form-control rounded-0" placeholder="Email address" required />
                        </div>
                        <div className="form-group">
                            <input type="password" id="inputPassword" className="form-control rounded-0" placeholder="Password" required />
                        </div>
                        <Button
                            name="Sign up"
                            onClick={(e) => this.handleSignup(e)}
                        />
                    </form>
                </div>
            </Fragment>
        );
    }
}