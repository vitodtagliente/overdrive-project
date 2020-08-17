import React from 'react';
import { Module, Sidebar, Card, Icon } from 'overdrive-dashboard';

const Schema = {
    name: {
        display: "Name",
        required: true,
        type: String,
        placeholder: "Enter the item name"
    },
    type: {
        display: "Type",
        required: true,
        type: String,
        placeholder: "Enter the type"
    },
    isConsumable: {
        type: Boolean
    },
    isStackable: {
        type: Boolean
    },
    isEquippable: {
        type: Boolean
    },
    power: {
        display: "Power",
        type: Number,
        placeholder: "Enter the power"
    }
}

export default class TestModule extends Module {
    constructor(url, id) {
        super(url, id);
    }

    sidebar() {
        return (
            <Sidebar.Item
                url={this.url}
                active={true}
                name="Test Component"
                icon={Icon.Images.faDog}
                color="purple"
            />
        );
    }

    content(context) {
        return (
            <>
                <Module.SimpleCRUD
                    name="Test Component"
                    description="Foo sisjfiowegsopgehesgji"
                    icon={Icon.Images.faDog}
                    color={'purple'}
                    columns={{ _id: 'Id', name: 'Name' }}
                    schema={Schema}
                    api="http://localhost:9000/api/items"
                >
                </Module.SimpleCRUD>
            </>
        );
    }
};