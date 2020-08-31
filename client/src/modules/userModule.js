import React from 'react';
import { Module, Sidebar, Icon } from 'overdrive-dashboard';

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
                <Module.CRUD
                    name="Users"
                    description="Manage the users of the application"
                    icon={Icon.Images.faUser}
                    color={'pink'}
                    fields={{ username: 'Username', email: 'Email', role: 'Role' }}
                    schema={Schema}
                    api="http://localhost:9000/users"
                >
                </Module.CRUD>
            </>
        );
    }
};