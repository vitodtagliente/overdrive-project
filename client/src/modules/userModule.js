import React, { Fragment } from 'react';
import { Module, Sidebar, Icon, ActionBar } from 'overdrive-dashboard';

const Schema = {
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        display: 'Username',
        placeholder: 'Enter the username'
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        display: 'Email',
        placeholder: 'Enter the email'
    },
    password: {
        type: String,
        required: true,
        display: 'Password',
        placeholder: 'Enter the password'
    },
    role: {
        type: String,
        enum: ['player', 'content-creator', 'admin'],
        required: true,
        default: 'player',
        display: 'Role',
        placeholder: 'Enter the role'
    }
}

export default class UserModule extends Module {
    constructor(url, id) {
        super('users', id);
    }

    sidebar() {
        return (
            <Sidebar.Item
                url={this.url}
                active={this.isActive}
                name="Users"
                icon={Icon.Images.faUser}
                color="pink"
            />
        );
    }

    content(context) {
        return (
            <>
                <CRUD
                    name="Users"
                    description="Manage the users of the application"
                    icon={Icon.Images.faUser}
                    color={'pink'}
                    fields={{ username: 'Username', email: 'Email', role: 'Role' }}
                    schema={Schema}
                    api="http://localhost:9000/users"
                >
                </CRUD>
            </>
        );
    }
};

const Action = {
    Profile: 'profile'
};

class CRUD extends Module.CRUD {
    constructor(props) {
        super(props);
    }

    getView(action) {
        if (action == Action.Profile)
        {
            return (
                <p>Hello</p>
            );
        }
        else return super.getView(action);
    }

    getActionBar() {
        return (
            <ActionBar>
                <ActionBar.Button
                    icon={Icon.Images.faUserCircle}
                    name="Edit Profile"
                    onClick={(e) => this.handleActionChange(Action.Profile)} />
                <ActionBar.Button
                    active={this.state.selectedRecords.length === 1}
                    icon={Icon.Images.faUserEdit}
                    name="Change Role"
                />
            </ActionBar>
        )
    }

}